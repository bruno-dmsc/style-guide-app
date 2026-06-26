from flask import Flask, jsonify
from flask_cors import CORS
import os
import json
from pathlib import Path

from extrator_dashboard import buscar_todas_demandas, buscar_sprints_agile, preencher_rn_na_por_sprint, buscar_total_subcorrecoes, atualizar_retornos_demanda_pai
from calculadora_sla import processar_slas

app = Flask(__name__)
CORS(app) # Permite que o Angular (localhost:4200) converse com o Python

@app.route('/api/atualizar', methods=['POST'])
def atualizar_dados():
    print("🚀 Iniciando extração do JIRA via painel...")
    
    try:
        
        contagem_retornos = buscar_total_subcorrecoes()
        atualizar_retornos_demanda_pai(contagem_retornos)
        
        lista_sprints = buscar_sprints_agile()
        lista_demandas = buscar_todas_demandas()
        
        base_dados = {
            "sprints": lista_sprints,
            "demandas": lista_demandas
        }
        
        # Caminho relativo para o arquivo de dados consumido pelo Angular
        base_dir = Path(__file__).resolve().parent
        caminho_angular = base_dir.parent.parent / "frontend" / "src" / "assets" / "sprint-data.json"

        # Garante que as pastas do caminho existam
        caminho_angular.parent.mkdir(parents=True, exist_ok=True)

        with open(caminho_angular, "w", encoding="utf-8") as f:
            json.dump(base_dados, f, ensure_ascii=False, indent=2)
            
        print("✅ Dados salvos com sucesso na pasta do Angular!")
        
        processar_slas()

        return jsonify({"status": "sucesso", "mensagem": "Dados atualizados com sucesso!"})
        
    except Exception as e:
        print(f"❌ Erro durante a atualização: {e}")
        return jsonify({"status": "erro", "mensagem": str(e)}), 500

@app.route('/api/preencher-rn/<int:sprint_id>', methods=['POST'])
def preencher_rns(sprint_id):
    print(f"🚀 Iniciando preenchimento automático de RNs (N/A) para a Sprint {sprint_id}...")
    
    try:
        resultado = preencher_rn_na_por_sprint(sprint_id)
        return jsonify({
            "status": "sucesso", 
            "mensagem": f"{resultado['atualizadas']} demandas atualizadas com N/A."
        })
    except Exception as e:
        print(f"❌ Erro durante o preenchimento de RN: {e}")
        return jsonify({"status": "erro", "mensagem": str(e)}), 500

if __name__ == '__main__':
    # Roda um servidor local na porta 5000
    print("Servidor Flask rodando! Aguardando chamadas do Painel...")
    app.run(port=5000, debug=True)