from pathlib import Path
import json
import os
from datetime import datetime, timedelta

base_dir = Path(__file__).resolve().parent

CAMINHO_DADOS = base_dir.parent.parent / "frontend" / "src" / "assets" / "sprint-data.json"
PASTA_CONFIGS = base_dir / "config_sla"

def carregar_config(cliente_nome):
    arquivo_cliente = os.path.join(PASTA_CONFIGS, f"{cliente_nome}.json")
    arquivo_global = os.path.join(PASTA_CONFIGS, "sla_global.json")
    caminho_usado = arquivo_cliente if os.path.exists(arquivo_cliente) else arquivo_global
    
    with open(caminho_usado, 'r', encoding='utf-8') as f:
        return json.load(f)

def calcular_data_limite(data_criacao_str, horas_sla, config):
    # O JIRA retorna algo como '2026-05-11T12:38:42.922-0300'
    formato_jira = "%Y-%m-%dT%H:%M:%S.%f%z"
    try:
        data_atual = datetime.strptime(data_criacao_str, formato_jira)
    except ValueError:
        return None # Falha no parse

    minutos_restantes = int(horas_sla * 60)
    
    inicio_exp = datetime.strptime(config['expediente']['inicio'], "%H:%M").time()
    fim_exp = datetime.strptime(config['expediente']['fim'], "%H:%M").time()
    inicio_almoco = datetime.strptime(config['almoco']['inicio'], "%H:%M").time()
    fim_almoco = datetime.strptime(config['almoco']['fim'], "%H:%M").time()
    dias_uteis = config['dias_uteis']

    while minutos_restantes > 0:
        data_atual += timedelta(minutes=1)
        
        dia_semana = data_atual.weekday()
        hora_atual = data_atual.time()
        
        is_dia_util = dia_semana in dias_uteis
        is_expediente = inicio_exp <= hora_atual <= fim_exp
        is_almoco = inicio_almoco <= hora_atual < fim_almoco

        if is_dia_util and is_expediente and not is_almoco:
            minutos_restantes -= 1

    return data_atual # Retorna o objeto datetime completo para comparação

def processar_slas():
    print("⏳ Iniciando cálculo de SLA...")
    
    with open(CAMINHO_DADOS, 'r', encoding='utf-8') as f:
        dados = json.load(f)

    demandas = dados.get('demandas', [])
    formato_jira = "%Y-%m-%dT%H:%M:%S.%f%z"
    
    for d in demandas:
        tipo = d.get('tipo', '')
        prioridade = d.get('prioridade', 'Medium')
        cliente = d.get('cliente', '').strip()
        data_criacao = d.get('criado')
        data_resolvido_str = d.get('resolvido')

        config_ativa = carregar_config(cliente)
        regras_tipo = config_ativa['regras_horas'].get(tipo, {})
        horas_sla = regras_tipo.get(prioridade, 0)

        # Se houver SLA definido e a data de criação for válida
        if horas_sla > 0 and data_criacao:
            data_limite_dt = calcular_data_limite(data_criacao, horas_sla, config_ativa)
            
            if data_limite_dt:
                d['data_limite'] = data_limite_dt.strftime("%Y-%m-%dT%H:%M:%S")
                
                # CÁLCULO DE RESULTADO DO SLA AQUI
                if data_resolvido_str:
                    try:
                        resolvido_dt = datetime.strptime(data_resolvido_str, formato_jira)
                        # Compara diretamente os datetimes
                        if resolvido_dt <= data_limite_dt:
                            d['no_prazo'] = 'Sim'
                        else:
                            d['no_prazo'] = 'Não'
                    except ValueError:
                        d['no_prazo'] = '-'
                else:
                    d['no_prazo'] = '-' # Não está resolvido ainda
            else:
                d['data_limite'] = ""
                d['no_prazo'] = "-"
        else:
            d['data_limite'] = ""
            d['no_prazo'] = "-"
            
    with open(CAMINHO_DADOS, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
        
    print(f"✅ SLA processado (limite e status) para {len(demandas)} demandas.")

if __name__ == "__main__":
    processar_slas()