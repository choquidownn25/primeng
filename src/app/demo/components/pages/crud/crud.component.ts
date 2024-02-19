import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { Producto } from 'src/app/demo/api/producto';
import { ProductoService } from 'src/app/demo/service/producto.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
})
export class CrudComponent implements OnInit {
    pageChange($event: any) {
        throw new Error('Method not implemented.');
    }
    productDialogs: boolean = false;

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];
    productos: Producto[] = [];
    product: Product = {};
    producto: Producto = {
        id: 0,
        nombre: '',
        descripcion: '',
        precio: 0,
        cantidad: 0,
        imagen: 0
    };
    productoSeleccionado: Producto = new Producto();
    displayEditDialog: boolean = false;
    productoAEditar: any;
    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    selectedProduct: any;
    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private productoService: ProductoService
    ) {}

    ngOnInit() {
        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' },
        ];
        this.productoService.get().subscribe(
            (data) => {
                this.productos = data;
            },
            (error) => {
                console.error('Error al obtener productos: ', error);
            }
        );
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }
    openNews() {
        this.product = {};
        this.submitted = false;
        this.productDialogs = true;
    }
    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(
            (val) => val.id !== this.product.id
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
    hideDialogs() {
        this.productDialogs = false;
        this.submitted = false;
    }
    hideDialogsEdit() {
        this.displayEditDialog = false;
        this.submitted = false;
    }
    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    .value
                    ? this.product.inventoryStatus.value
                    : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] =
                    this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    ? this.product.inventoryStatus.value
                    : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000,
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }
    saveProducts() {
        this.productoService.addItem(this.producto);
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Created',
            life: 3000,
        });
        this.productDialogs = false;
        this.submitted = false;
    }
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
     // Función para mostrar el diálogo de edición
     showEditDialog(producto: any) {
        this.selectedProduct = producto;
        this.displayEditDialog = true;
    }

    // Método para abrir el diálogo de edición
    editProducts(producto: Producto) {
        this.producto = { ...producto }; // Clonamos el objeto para evitar modificar directamente los datos de la tabla
        this.displayEditDialog = true;

    }

    saveProductsEdit() {
        this.productoService.updateItem(this.producto);
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Created',
            life: 3000,
        });
         this.displayEditDialog = false;
    }
}
