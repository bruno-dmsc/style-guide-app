from pathlib import Path
import os
import requests
import json
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

base_dir = Path(__file__).resolve().parent
env_path = base_dir / ".env"
if not env_path.exists():
    env_path = base_dir / "production.env"
load_dotenv(env_path)

JIRA_URL = os.getenv("JIRA_URL")
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")

JIRA_RN_FIELD_ID = os.getenv("JIRA_RN_FIELD_ID")
JIRA_CLIENTE_FIELD_ID = os.getenv("JIRA_CLIENTE_FIELD_ID")
JIRA_RETORNOS_FIELD_ID = os.getenv("JIRA_RETORNOS_FIELD_ID")

AUTH = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)
HEADERS = {"Accept": "application/json"}

def buscar_icones_tipos_demanda():
    print("🔄 Extraindo dados do projeto...")
    url = f"{JIRA_URL}/rest/api/3/issuetype/project"
    tipos = []
    try:
        resp = requests.get(url, headers=HEADERS, auth=AUTH, params={"projectId": 10008, "level": 0})
        resp.raise_for_status()
        dados = resp.json()

        for tipo in dados:
            tipos.append({
                "nome": tipo.get("name"),
                "icone": tipo.get("iconUrl")
            })
        
        print(f"✅ {len(tipos)} tipos de demandas encontrados.")
        return tipos

    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao buscar dados do projeto: {e}")
        return []


def buscar_sprints_agile():
    """Busca todas as sprints do board via API Agile."""
    print("🔄 Extraindo lista de Sprints...")
    url = f"{JIRA_URL}/rest/agile/1.0/board/36/sprint"
    sprints_limpas = []
    
    try:
        # A API Agile usa startAt e maxResults para paginação
        is_last = False
        start_at = 0
        
        while not is_last:
            resp = requests.get(url, headers=HEADERS, auth=AUTH, params={'startAt': start_at})
            resp.raise_for_status()
            dados = resp.json()
            
            for s in dados.get('values', []):
                sprints_limpas.append({
                    "id": s.get("id"),
                    "name": s.get("name"),
                    "state": s.get("state"),
                    "startDate": s.get("startDate"),
                    "endDate": s.get("endDate"),
                    "completeDate": s.get("completeDate")
                })
                
            is_last = dados.get('isLast', True)
            start_at += len(dados.get('values', []))
            
        print(f"✅ {len(sprints_limpas)} Sprints encontradas.")
        return sprints_limpas
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao buscar sprints: {e}")
        return []

def buscar_todas_demandas():
    """Busca as demandas massivamente para alimentar os KPIs e o Histórico de RN."""
    print("🔄 Extraindo base histórica de Demandas...")
    url = f"{JIRA_URL}/rest/api/3/search/jql"
    
    max_results = 100
    next_page_token = ""
    demandas_limpas = []

    # JQL alterado para pegar o projeto inteiro (excluindo Épicos, se desejar)
    jql = 'project = IBR AND type IN standardIssueTypes() and type != Epic and status = Concluído'
    campos = f"summary,issuetype,priority,status,resolution,assignee,created,resolutiondate,customfield_10020,{JIRA_RN_FIELD_ID},{JIRA_CLIENTE_FIELD_ID},{JIRA_RETORNOS_FIELD_ID}"

    while True:
        query = {
            'jql': jql,
            'maxResults': max_results,
            'fields': campos,
            'nextPageToken': next_page_token
        }

        try:
            resp = requests.get(url, headers=HEADERS, params=query, auth=AUTH)
            resp.raise_for_status() 
            
            dados = resp.json()
            issues = dados.get('issues', [])
            
            for issue in issues:
                c = issue.get('fields', {})
                
                # Tratamento de campos aninhados e nulos
                tipo = c.get('issuetype', {}).get('name', '')
                status = c.get('status', {}).get('name', '')
                prioridade = c.get('priority', {}).get('name', 'Medium')
                resolucao_obj = c.get('resolution')
                resolucao = resolucao_obj.get('name', '') if resolucao_obj else ''
                
                assignee_obj = c.get('assignee')
                responsavel = assignee_obj.get('displayName', 'Não atribuído') if assignee_obj else 'Não atribuído'
                
                # O campo customfield_10020 geralmente é o padrão do Jira para mapear a Sprint em arrays
                sprints_array = c.get('customfield_10020', [])
                sprint_ids = [s.get('id') for s in sprints_array if isinstance(s, dict)] if sprints_array else []
                # Pega a última sprint associada à demanda
                sprint_id = sprint_ids[-1] if sprint_ids else None
                
                retornos = c.get(JIRA_RETORNOS_FIELD_ID) or 0
                cliente = c.get(JIRA_CLIENTE_FIELD_ID) or ""
                rn_texto = c.get(JIRA_RN_FIELD_ID) or ""
                
                demandas_limpas.append({
                    "chave": issue.get('key'),
                    "tipo": tipo,
                    "prioridade": prioridade,
                    "resumo": c.get('summary', ''),
                    "status": status,
                    "resolucao": resolucao,
                    "responsavel": responsavel,
                    "cliente": str(cliente),
                    "criado": c.get('created'),
                    "resolvido": c.get('resolutiondate'),
                    "retornos_teste": float(retornos) if retornos else 0,
                    "rn_texto": str(rn_texto).strip(),
                    "sprint_id": sprint_id
                })
            
            next_page_token = dados.get('nextPageToken', '')
            print(f"  [+] Lote processado... Total acumulado: {len(demandas_limpas)}")
            
            if len(issues) < max_results or next_page_token == "":
                break

        except requests.exceptions.RequestException as e:
            print(f"❌ Erro na extração massiva: {e}")
            break

    print(f"✅ Extração finalizada. {len(demandas_limpas)} demandas estruturadas.")
    return demandas_limpas

def preencher_rn_na_por_sprint(sprint_id):
    """Preenche 'N/A' no campo de Release Notes para demandas específicas da Sprint."""
    print(f"🔄 Buscando demandas da Sprint {sprint_id} para preenchimento de RN...")
    
    # Filtra os tipos padrão e traz somente demandas onde o Release Notes está vazio
    jql = f'project = IBR AND sprint = {sprint_id} AND type IN standardIssueTypes() and status = Concluído AND {JIRA_RN_FIELD_ID} is EMPTY'
    campos = f"issuetype,status,resolution,{JIRA_RN_FIELD_ID}"
    url_search = f"{JIRA_URL}/rest/api/3/search/jql"
    
    try:
        max_results = 100
        next_page_token = ""
        demandas_atualizadas = 0
        
        while True:
            params = {
                'jql': jql, 
                'maxResults': max_results, 
                'fields': campos,
                'nextPageToken': next_page_token
            }
            
            resp = requests.get(url_search, headers=HEADERS, auth=AUTH, params=params)
            resp.raise_for_status()
            
            dados = resp.json()
            issues = dados.get('issues', [])
            
            for issue in issues:
                chave = issue.get('key')
                c = issue.get('fields', {})
                
                tipo = c.get('issuetype', {}).get('name', '').lower()
                
                resolucao_obj = c.get('resolution')
                resolucao = resolucao_obj.get('name', '').lower() if resolucao_obj else ''
                status = c.get('status', {}).get('name', '').lower()
                
                rn_atual = c.get(JIRA_RN_FIELD_ID)
                
                # Regras para aplicar o "N/A"
                aplicar_na = False
                
                if tipo in ['tarefa', 'automação', 'automacao', 'task']:
                    aplicar_na = True
                elif tipo == 'bug' and 'concluído' not in [resolucao, status]:
                    aplicar_na = True
                    
                # Segurança extra: garante no código que o campo de fato está vazio
                if aplicar_na and (not rn_atual or str(rn_atual).strip() == ""):
                    
                    url_update = f"{JIRA_URL}/rest/api/3/issue/{chave}"
                    payload = json.dumps({
                        "fields": {
                            JIRA_RN_FIELD_ID: "N/A"
                        }
                    })
                    headers_update = {"Accept": "application/json", "Content-Type": "application/json"}
                    
                    update_resp = requests.put(url_update, headers=headers_update, auth=AUTH, data=payload)
                    
                    if update_resp.status_code == 204:
                        print(f"  [+] RN atualizado para 'N/A' na demanda {chave} ({tipo})")
                        demandas_atualizadas += 1
                    else:
                        print(f"  [-] Erro ao atualizar {chave}: {update_resp.text}")
            
            # Atualiza o token para a próxima página
            next_page_token = dados.get('nextPageToken', '')
            print(f"  [+] Lote de pesquisa processado... Total atualizado até agora: {demandas_atualizadas}")
            
            # Condição de saída do loop
            if len(issues) < max_results or next_page_token == "":
                break
                    
        print(f"✅ Preenchimento concluído. {demandas_atualizadas} demandas atualizadas com 'N/A'.")
        return {"status": "sucesso", "atualizadas": demandas_atualizadas}

    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao tentar atualizar RNs: {e}")
        raise e


def buscar_total_subcorrecoes():
    """Busca os chamados de Sub-correção, identifica a demanda pai e agrupa a contagem de retornos."""
    print("🔄 Mapeando sub-correções por demanda pai...")
    url = f"{JIRA_URL}/rest/api/3/search/jql"
    
    max_results = 100
    next_page_token = ""
    
    # Dicionário para armazenar a contagem: {"IBR-123": 2, "IBR-124": 1}
    contagem_retornos_por_pai = {}

    jql = 'project = IBR AND type = "Sub-correção"'
    # Trazemos parent e issuelinks para garantir que vamos achar o vínculo, seja qual for a estrutura
    campos = "parent"

    while True:
        query = {
            'jql': jql,
            'maxResults': max_results,
            'fields': campos,
            'nextPageToken': next_page_token
        }

        try:
            resp = requests.get(url, headers=HEADERS, params=query, auth=AUTH)
            resp.raise_for_status() 
            
            dados = resp.json()
            issues = dados.get('issues', [])
            
            for issue in issues:
                chave_sub = issue.get('key')
                c = issue.get('fields', {})
                chave_pai = None
                
                # Tentativa 1: Verifica se existe o vínculo direto de 'parent'
                if c.get('parent'):
                    chave_pai = c['parent'].get('key')
                
                if chave_pai:
                    # Incrementa o contador para esta demanda pai
                    if chave_pai in contagem_retornos_por_pai:
                        contagem_retornos_por_pai[chave_pai] += 1
                    else:
                        contagem_retornos_por_pai[chave_pai] = 1
                else:
                    print(f"  [!] Sub-correção {chave_sub} ignorada: não foi possível identificar a demanda pai.")
            
            next_page_token = dados.get('nextPageToken', '')
            
            if len(issues) < max_results or next_page_token == "":
                break

        except requests.exceptions.RequestException as e:
            print(f"❌ Erro ao buscar sub-correções: {e}")
            break

    print(f"\n✅ Resumo de retornos por demanda pai: {len(contagem_retornos_por_pai)}.")
        
    return contagem_retornos_por_pai

def atualizar_retornos_demanda_pai(contagem_retornos_por_pai):
    """Atualiza o campo numérico de retornos na demanda pai, validando o valor atual antes para evitar chamadas desnecessárias."""
    if not contagem_retornos_por_pai:
        print("Nenhuma sub-correção mapeada para processar.")
        return

    campo_retornos = JIRA_RETORNOS_FIELD_ID or "customfield_10356"
    
    # 1. Montar a JQL com as chaves extraídas
    chaves_pai = list(contagem_retornos_por_pai.keys())
    jql_chaves = ",".join(chaves_pai)
    jql = f"key IN ({jql_chaves})"
    
    print(f"\n🔄 Consultando os valores atuais para {len(chaves_pai)} demanda(s) pai no JIRA...")
    url_search = f"{JIRA_URL}/rest/api/3/search/jql"
    valores_atuais = {}
    
    try:
        # Busca paginada caso a lista cresça no futuro
        max_results = 100
        next_page_token = ""
        
        while True:
            query = {
                'jql': jql,
                'maxResults': max_results,
                'fields': campo_retornos,
                'nextPageToken': next_page_token
            }
            
            resp = requests.get(url_search, headers=HEADERS, params=query, auth=AUTH)
            resp.raise_for_status()
            
            dados = resp.json()
            issues = dados.get('issues', [])
            
            for issue in issues:
                chave = issue.get('key')
                valor_atual = issue.get('fields', {}).get(campo_retornos)
                
                # Campos numéricos podem vir como None se estiverem vazios
                if valor_atual is not None:
                    valores_atuais[chave] = float(valor_atual)
                else:
                    valores_atuais[chave] = 0.0
            
            next_page_token = dados.get('nextPageToken', '')
            if len(issues) < max_results or next_page_token == "":
                break
                
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao buscar os valores atuais das demandas pai: {e}")
        return

    # 2. Comparar e atualizar apenas o que for necessário
    print("\n🔄 Verificando necessidade de atualização...")
    demandas_atualizadas = 0
    demandas_ignoradas = 0

    for chave_pai, total_calculado in contagem_retornos_por_pai.items():
        valor_atual_jira = valores_atuais.get(chave_pai, 0.0)
        
        # Comparamos como float para evitar falsos positivos entre inteiros e decimais (ex: 2 vs 2.0)
        if valor_atual_jira == float(total_calculado):
            # print(f"  [=] Demanda {chave_pai} ignorada: O valor já está correto ({total_calculado}).")
            demandas_ignoradas += 1
            continue
            
        # Se for diferente, executamos o PUT
        url_update = f"{JIRA_URL}/rest/api/3/issue/{chave_pai}"
        payload = json.dumps({
            "fields": {
                campo_retornos: total_calculado
            }
        })
        headers_update = {"Accept": "application/json", "Content-Type": "application/json"}
        
        try:
            update_resp = requests.put(url_update, headers=headers_update, auth=AUTH, data=payload)
            if update_resp.status_code == 204:
                print(f"  [+] Demanda {chave_pai} atualizada (de {valor_atual_jira} para {total_calculado}).")
                demandas_atualizadas += 1
            else:
                print(f"  [-] Erro ao atualizar {chave_pai}: Status {update_resp.status_code} - {update_resp.text}")
        except requests.exceptions.RequestException as e:
            print(f"  [-] Falha de conexão ao tentar atualizar {chave_pai}: {e}")

    print(f"✅ Atualização concluída: {demandas_atualizadas} atualizada(s), {demandas_ignoradas} ignorada(s).")

if __name__ == "__main__":
    
    contagem_retornos = buscar_total_subcorrecoes()
    atualizar_retornos_demanda_pai(contagem_retornos)
    
    lista_sprints = buscar_sprints_agile()
    lista_demandas = buscar_todas_demandas()
    

    # Consolida os dados
    base_dados = {
        "sprints": lista_sprints,
        "demandas": lista_demandas
    }
    
    # Exporta para JSON
    nome_arquivo = r"C:\Users\bruno.damasceno\Desktop\iBR\Projetos\style-guide-app\src\assets\sprint-data.json"
    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(base_dados, f, ensure_ascii=False, indent=2)
        
    print("\n==================================================")
    print(f"🚀 ARQUIVO {nome_arquivo} GERADO COM SUCESSO!")
    print("O banco de dados para o Angular está pronto.")
    print("==================================================")