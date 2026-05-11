import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { PopoverModule } from 'primeng/popover';

// Importando os seus componentes do Design System
import { AccordionComponent } from '../accordion/accordion.component';
import { AccordionPanelComponent } from '../accordion/accordion-panel.component';
import { ButtonComponent } from '../button/button.component';

import Quill from 'quill';
import { Mention, MentionBlot } from 'quill-mention';

export interface EditorVariavelItem {
    label: string;
    valor: string;
}

export interface EditorVariavelGrupo {
    id: string;
    tema: string;
    itens: EditorVariavelItem[];
}

Quill.register({
    'blots/mention': MentionBlot,
    'modules/mention': Mention
});

const Embed: any = Quill.import('blots/embed');

class VariavelBlot extends Embed {
    // 2. Trazemos as propriedades para dentro da classe como 'static'
    static blotName = 'variavel';
    static tagName = 'span';
    static className = 'sg-variavel-tag';

    static create(data: any) {
        let node = super.create();

        // Se vier do botão, data é string (ex: "{{sku}}"). Se vier do plugin, é objeto.
        let valor = typeof data === 'string' ? data : data.id;

        node.innerHTML = valor;
        node.setAttribute('data-valor', valor);
        node.setAttribute('contenteditable', 'false');

        return node;
    }

    static value(node: any) {
        return node.getAttribute('data-valor');
    }
}

// 3. Registramos no Quill
Quill.register(VariavelBlot);

@Component({
    selector: 'app-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        EditorModule,
        PopoverModule,
        AccordionComponent,
        AccordionPanelComponent,
        ButtonComponent
    ],
    templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit {
    @Input() content: string = '';

    // Agora o componente recebe as variáveis de fora
    @Input() configVariaveis: EditorVariavelGrupo[] = [];

    // Acesso direto à API do Quill
    private quillInstance: any;

    activeAccordions: string[] = [];

    // Configuração preparada para o quill-mention
    editorModules = {
        toolbar: '#custom-toolbar',
        mention: {
            allowedChars: /^[A-Za-z\s_.]*$/,
            mentionDenotationChars: ["/"],
            isolateCharacter: true,
            blotName: 'variavel',
            source: this.mentionSource.bind(this),
            renderItem: (item: any) => {
                // 1. Criamos um container DOM real
                const element = document.createElement('div');
                element.className = 'sg-mention-item-wrapper'; // Apenas um wrapper para não quebrar nosso CSS

                // 2. Injetamos o HTML de forma segura no innerHTML deste elemento
                element.innerHTML = `
                    <div class="sg-mention-item">
                        <span class="sg-mention-tema">${item.tema}</span>
                        <div class="sg-mention-content">
                            <span class="sg-mention-label">${item.value}</span>
                            <span class="sg-mention-id">${item.id}</span>
                        </div>
                    </div>
                `;

                // 3. Retornamos o Nó DOM, que o plugin renderizará perfeitamente
                return element;
            }
        }
    };

    ngOnInit() {
        // Inicializamos os IDs das abas que começam abertas
        this.activeAccordions = this.configVariaveis.map(g => g.id);

        // Configuramos o módulo aqui para garantir que o source use o Input atualizado
        this.editorModules = {
            toolbar: '#custom-toolbar',
            mention: {
                allowedChars: /^[A-Za-z\s_.]*$/,
                mentionDenotationChars: ["/"],
                isolateCharacter: true,
                blotName: 'variavel',
                source: this.mentionSource.bind(this),
                renderItem: (item: any) => {
                    const element = document.createElement('div');
                    element.innerHTML = `
                        <div class="sg-mention-item">
                            <span class="sg-mention-tema">${item.tema}</span>
                            <div class="sg-mention-content">
                                <span class="sg-mention-label">${item.value}</span>
                                <span class="sg-mention-id">${item.id}</span>
                            </div>
                        </div>
                    `;
                    return element;
                }
            }
        };
    }

    onEditorInit(event: any) {
        this.quillInstance = event.editor;
    }

    inserirVariavel(valor: string) {
        if (!this.quillInstance) return;

        const range = this.quillInstance.getSelection(true);

        // 1. Insere o Bloco Atômico (Chip) de uma vez só
        this.quillInstance.insertEmbed(range.index, 'variavel', valor, 'user');

        // 2. Insere um espaço em branco logo após o chip
        this.quillInstance.insertText(range.index + 1, ' ', 'user');

        // 3. Move o cursor para o espaço em branco, pronto para digitar texto normal
        this.quillInstance.setSelection(range.index + 2, 'silent');
    }

    mentionSource(searchTerm: string, renderList: Function) {
        const flatList = this.configVariaveis.flatMap(grupo => 
            grupo.itens.map(item => ({ 
                id: item.valor,     
                value: item.label,
                tema: grupo.tema 
            }))
        );

        if (searchTerm.length === 0) {
            renderList(flatList, searchTerm);
        } else {
            const matches = flatList.filter(item => 
                item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tema.toLowerCase().includes(searchTerm.toLowerCase())
            );
            renderList(matches, searchTerm);
        }
    }

    executarComando(comando: string, valor: any = true) {
        if (this.quillInstance) {
            const format = this.quillInstance.getFormat();
            // Alterna o formato (se já estiver ativo, remove; se não, aplica)
            this.quillInstance.format(comando, !format[comando]);
        }
    }

}