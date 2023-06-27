"use strict";(self.webpackChunkGestorIncidentesFront=self.webpackChunkGestorIncidentesFront||[]).push([[37],{8037:(A,m,a)=>{a.r(m),a.d(m,{EstadoIncidentesModule:()=>v});var c=a(4755),u=a(2889),t=a(3020),f=a(8225),d=a(5030),_=a(9879);function b(o,i){if(1&o&&(t.TgZ(0,"h1",14),t._uU(1),t.qZA()),2&o){const e=t.oxw();t.xp6(1),t.hij(" Editar ",e.EstadoIncidenteInput.est_nombre," ")}}let I=(()=>{class o{constructor(){this.fb=(0,t.f3M)(d.qu),this.validatorService=(0,t.f3M)(_.S),this.modalOff=new t.vpe,this.miFormulario=this.fb.group({id:[0],rol_nombre:["",[d.kI.required]],rol_descripcion:["",[d.kI.required]]})}ngOnChanges(e){if(0!==this.EstadoIncidenteInput.id){const{id:n,est_nombre:s,est_descripcion:r}=this.EstadoIncidenteInput;this.miFormulario.setValue({id:n,rol_nombre:s,rol_descripcion:r})}}onSubmit(){this.miFormulario.invalid?this.miFormulario.markAllAsTouched():console.log(this.miFormulario.value)}cerrarModal(){this.modalOff.emit(!1),this.miFormulario.reset()}}return o.\u0275fac=function(e){return new(e||o)},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-estadoIncidenteModal"]],inputs:{EstadoIncidenteInput:"EstadoIncidenteInput"},outputs:{modalOff:"modalOff"},features:[t.TTD],decls:19,vars:2,consts:[["id","Modal","tabindex","-1","aria-labelledby","Modal","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog"],[1,"modal-content"],[1,"modal-header"],["class","modal-title fs-5","id","exampleModalLabel",4,"ngIf"],["type","button","data-bs-dismiss","modal","aria-label","Close",1,"btn-close",3,"click"],[1,"modal-body"],["autocomplete","off",3,"formGroup","ngSubmit"],["for","nombre",1,"form-label"],["type","text","id","est_nombre","formControlName","est_nombre","required","",1,"form-control"],["for","descripcion",1,"form-label"],["type","text","id","est_descripcion","formControlName","est_descripcion","required","",1,"form-control"],[1,"modal-footer"],["type","submit",1,"btn","btn-primary",3,"click"],["id","exampleModalLabel",1,"modal-title","fs-5"]],template:function(e,n){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),t.YNc(4,b,2,1,"h1",4),t.TgZ(5,"button",5),t.NdJ("click",function(){return n.cerrarModal()}),t.qZA()(),t.TgZ(6,"div",6)(7,"h2"),t._uU(8,"Formulario"),t.qZA(),t.TgZ(9,"form",7),t.NdJ("ngSubmit",function(){return n.onSubmit()}),t.TgZ(10,"label",8),t._uU(11,"Nombre Estado Incidente:"),t.qZA(),t._UZ(12,"input",9),t.TgZ(13,"label",10),t._uU(14,"Descripcion:"),t.qZA(),t._UZ(15,"input",11),t.qZA()(),t.TgZ(16,"div",12)(17,"button",13),t.NdJ("click",function(){return n.onSubmit()}),t._uU(18," Enviar Solicitud "),t.qZA()()()()()),2&e&&(t.xp6(4),t.Q6J("ngIf",n.EstadoIncidenteInput),t.xp6(5),t.Q6J("formGroup",n.miFormulario))},dependencies:[c.O5,d._Y,d.Fj,d.JJ,d.JL,d.Q7,d.sg,d.u]}),o})();function h(o,i){if(1&o){const e=t.EpF();t.TgZ(0,"tr",7)(1,"th",11),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.ALo(5,"titlecase"),t.qZA(),t.TgZ(6,"td"),t._uU(7),t.qZA(),t.TgZ(8,"td"),t._uU(9),t.ALo(10,"date"),t.qZA(),t.TgZ(11,"td")(12,"div",12)(13,"button",13),t.NdJ("click",function(){const r=t.CHM(e).$implicit,l=t.oxw();return t.KtG(l.editarIncidente(r))}),t._UZ(14,"i",14),t._uU(15," Editar "),t.qZA(),t.TgZ(16,"button",15),t.NdJ("click",function(){const r=t.CHM(e).$implicit,l=t.oxw();return t.KtG(l.eliminarIncidente(r))}),t._UZ(17,"i",16),t._uU(18," Eliminar "),t.qZA()()()()}if(2&o){const e=i.$implicit;t.xp6(2),t.Oqu(e.id),t.xp6(2),t.Oqu(t.lcZ(5,4,e.est_nombre)),t.xp6(3),t.Oqu(e.est_descripcion),t.xp6(2),t.Oqu(t.lcZ(10,6,e.createdAt))}}let p=(()=>{class o{constructor(){this.estadosIncidentes=[],this.estadoIncidentesService=(0,t.f3M)(f.s),this.estadoIncidenteSeleccionado={id:0,est_nombre:"",est_estado:!0,est_descripcion:"",createdAt:new Date,updatedAt:new Date},this.modalOn=!1,this.obtenerRoles()}obtenerRoles(){this.estadoIncidentesService.getEstadoIncidentes().subscribe(({estadoIncidentesMy:e,estadoIncidentesMo:n})=>{this.estadosIncidentes=e||n})}crearRole(){}editarIncidente(e){console.log("Clickeado editar",e.est_nombre),this.estadoIncidenteSeleccionado=e}eliminarIncidente(e){console.log("Clickeado elimiar",e.est_nombre),this.estadoIncidenteSeleccionado=e}onCloseModal(e){this.modalOn=e,this.estadoIncidenteSeleccionado={id:0,est_nombre:"",est_estado:!0,est_descripcion:"",createdAt:new Date,updatedAt:new Date}}}return o.\u0275fac=function(e){return new(e||o)},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-listado"]],decls:24,vars:2,consts:[[1,"container-fluid","p-0","m-0"],[1,"row","d-flex","justify-content-around","m-0","p-0","animate__animated","animate__fadeIn"],[1,"col","p-2"],["type","button","data-bs-toggle","modal","data-bs-target","#Modal",1,"btn","btn-primary","rounded-circle","btnCustom"],[1,"col","d-flex","justify-content-end","p-2"],[1,"table-responsive"],[1,"table","table-bordered","table-hover","text-center","animate__animated","animate__fadeIn"],[1,"animate__animated","animate__fadeIn"],["scope","col"],["class","animate__animated animate__fadeIn",4,"ngFor","ngForOf"],[3,"EstadoIncidenteInput","modalOff"],["scope","row"],[1,"d-flex","justify-content-center","align-content-center"],["type","button","data-bs-toggle","modal","data-bs-target","#Modal",1,"btn","btn-warning","btn-sm","me-1",3,"click"],["aria-hidden","true",1,"fa","fa-pencil"],["type","button",1,"btn","btn-danger","btn-sm","me-1",3,"click"],["aria-hidden","true",1,"fa","fa-trash-o"]],template:function(e,n){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"h3"),t._uU(4,"Estado Incidentes"),t.qZA(),t._UZ(5,"button",3),t.qZA(),t._UZ(6,"div",4),t.qZA(),t.TgZ(7,"div",5)(8,"table",6)(9,"thead")(10,"tr",7)(11,"th",8),t._uU(12,"#"),t.qZA(),t.TgZ(13,"th",8),t._uU(14,"rol_nombre"),t.qZA(),t.TgZ(15,"th",8),t._uU(16,"rol_descripcion"),t.qZA(),t.TgZ(17,"th",8),t._uU(18,"Fecha Creacion"),t.qZA(),t.TgZ(19,"th",8),t._uU(20,"Acciones"),t.qZA()()(),t.TgZ(21,"tbody"),t.YNc(22,h,19,8,"tr",9),t.qZA()()(),t.TgZ(23,"app-estadoIncidenteModal",10),t.NdJ("modalOff",function(r){return n.onCloseModal(r)}),t.qZA()()),2&e&&(t.xp6(22),t.Q6J("ngForOf",n.estadosIncidentes),t.xp6(1),t.Q6J("EstadoIncidenteInput",n.estadoIncidenteSeleccionado))},dependencies:[c.sg,I,c.rS,c.uU]}),o})();const g=[{path:"",component:p,children:[{path:"listado",component:p},{path:"**",redirectTo:"listado"}]}];let Z=(()=>{class o{}return o.\u0275fac=function(e){return new(e||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[u.Bz.forChild(g),u.Bz]}),o})();var T=a(1041);let v=(()=>{class o{}return o.\u0275fac=function(e){return new(e||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[c.ez,Z,d.UX,T.D]}),o})()}}]);