import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [
        CommonModule,
        FileUploadModule,
        ProgressSpinnerModule,
        ButtonModule
    ],
    templateUrl: './upload.component.html'
})
export class UploadComponent {
    @ViewChild('primeUpload') primeUpload!: FileUpload;

    @Input() accept: string = 'image/*,video/*';
    @Input() multiple: boolean = true;
    @Input() maxFiles: number = 4;
    @Input() isLoading: boolean = false;
    @Input() disabled: boolean = false;

    @Input() title: string = 'Arraste seus arquivos para cá';
    @Input() subtitle: string = 'ou clique para procurar no computador';
    @Input() loadingText: string = 'Processando arquivos...';

    @Output() onFilesSelected = new EventEmitter<{ originalEvent: any, uploader: FileUpload }>();
    @Output() onFileRemoved = new EventEmitter<number>();

    errorMessage: string | null = null;

    // INJEÇÃO: Adicionando o detector de mudanças do Angular
    constructor(private cdr: ChangeDetectorRef) { }

    ngAfterViewInit() {
        // TRUQUE MÁGICO: Aplica o filtro de formato direto no input nativo.
        // Isso evita o bloqueio silencioso do PrimeNG e garante que o nosso
        // handleSelect consiga processar o arquivo inválido e exibir a mensagem de erro.
        if (this.primeUpload && this.primeUpload.advancedFileInput) {
            this.primeUpload.advancedFileInput.nativeElement.setAttribute('accept', this.accept);
        }
    }

    handleSelect(event: any) {
        this.errorMessage = null;

        // 1. Validação de Quantidade
        if (this.primeUpload.files.length > this.maxFiles) {
            this.primeUpload.files.splice(this.maxFiles);
            this.errorMessage = `Limite excedido. Você pode enviar no máximo ${this.maxFiles} arquivo(s).`;
            this.cdr.detectChanges(); // FORÇA A ATUALIZAÇÃO DA TELA
            return;
        }

        // 2. Validação de Formato
        if (this.accept) {
            const acceptedTypes = this.accept.split(',').map(t => t.trim().toLowerCase());

            for (let file of event.currentFiles) {
                const fileType = file.type ? file.type.toLowerCase() : '';
                const fileExt = file.name.includes('.') ? '.' + file.name.split('.').pop()?.toLowerCase() : '';

                const isValid = acceptedTypes.some(type => {
                    if (type.endsWith('/*')) {
                        return fileType.startsWith(type.replace('/*', ''));
                    }
                    return fileType === type || fileExt === type;
                });

                if (!isValid) {
                    // LIMPA A FILA INTEIRA SE HOUVER ERRO
                    this.primeUpload.clear();
                    this.errorMessage = `Formato inválido. Os formatos aceitos são: ${this.accept}`;
                    this.cdr.detectChanges(); // FORÇA A ATUALIZAÇÃO DA TELA DE ERRO
                    return;
                }
            }
        }

        // 3. Emite o sucesso (O carregamento ocorrerá via app.ts)
        this.onFilesSelected.emit({ originalEvent: event, uploader: this.primeUpload });
    }

    handleRemove(event: Event, index: number) {
        this.primeUpload.remove(event, index);
        this.errorMessage = null;
        this.onFileRemoved.emit(index);
    }

    triggerChoose() {
        if (!this.disabled && !this.isLoading) {
            this.primeUpload.choose();
        }
    }

    clearError() {
        this.errorMessage = null;
        this.primeUpload.clear();
        this.cdr.detectChanges(); // Garante que a tela volte ao modo vazio
    }
}