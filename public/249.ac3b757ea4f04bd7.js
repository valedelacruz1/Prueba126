"use strict";(self.webpackChunkGestorIncidentesFront=self.webpackChunkGestorIncidentesFront||[]).push([[249],{3249:(C,s,a)=>{a.r(s),a.d(s,{AuthModule:()=>M});var u=a(4755),l=a(2889),e=a(3020);function c(n,i){1&n&&(e.TgZ(0,"div",2)(1,"div",3)(2,"div",4)(3,"h1",5),e._uU(4,"SISTEMA GESTOR DE INCIDENTES"),e.qZA(),e._UZ(5,"router-outlet"),e.qZA()()())}function m(n,i){1&n&&(e.TgZ(0,"div",6)(1,"div",7)(2,"div",8)(3,"h2",5),e._uU(4,"SISTEMA GESTOR DE INCIDENTES"),e.qZA(),e._UZ(5,"router-outlet"),e.qZA()()())}let f=(()=>{class n{constructor(){}ngOnInit(){}isMobile(){const t=window.navigator.userAgent;return/Mobi/.test(t)}}return n.\u0275fac=function(t){return new(t||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-main"]],decls:2,vars:2,consts:[["class"," container-fluid main d-flex justify-content-center animate__animated animate__fadeIn",4,"ngIf"],["class","container-fluid main-mobile-only d-flex justify-content-center animate__animated animate__fadeIn ",4,"ngIf"],[1,"container-fluid","main","d-flex","justify-content-center","animate__animated","animate__fadeIn"],[1,"col-auto","d-flex","justify-content-center","align-items-center"],[1,"container-fluid"],[1,"mb-5"],[1,"container-fluid","main-mobile-only","d-flex","justify-content-center","animate__animated","animate__fadeIn"],[1,"col-auto","d-flex","justify-content-center","align-items-center","m-0","p-0"],[1,"container-fluid","m-0","p-0"]],template:function(t,r){1&t&&(e.YNc(0,c,6,0,"div",0),e.YNc(1,m,6,0,"div",1)),2&t&&(e.Q6J("ngIf",!1===r.isMobile()),e.xp6(1),e.Q6J("ngIf",r.isMobile()))},dependencies:[u.O5,l.lC],styles:[".main[_ngcontent-%COMP%]{width:100%;height:100vh;background-repeat:no-repeat;background-image:url(fondocorponor.e11aa2d6dba1f07b.png);background-position:center center;background-size:cover;background-attachment:fixed}.main-mobile-only[_ngcontent-%COMP%]{width:100%;height:100%;background-position:center;background-repeat:no-repeat;background-size:cover;background-attachment:fixed;background-image:url(fondo_logo.97fe7577deed8373.png)}"]}),n})();var o=a(5030),p=a(7501),g=a(5226),h=a.n(g);const v=[{path:"",component:f,children:[{path:"login",component:(()=>{class n{constructor(){this.fb=(0,e.f3M)(o.qu),this.authService=(0,e.f3M)(p.e),this.router=(0,e.f3M)(l.F0),this.miFormulario=this.fb.group({username:["test1",[o.kI.required]],password:["test1pass",[o.kI.required,o.kI.minLength(6)]]})}login(){const{username:t,password:r}=this.miFormulario.value;this.authService.login(t,r).subscribe({next:()=>{"ADMIN_ROLE"===this.authService.role()?this.router.navigate(["/dashboard"]):this.router.navigate(["/incidentes"])},error:d=>{h().fire("Error",d,"error")}})}}return n.\u0275fac=function(t){return new(t||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-login"]],decls:15,vars:2,consts:[[1,"col","animate__animated","animate__fadeIn","m-0","p-0"],[1,"container-fluid","m-0","p-0"],[1,"col"],["autocomplete","off",3,"formGroup","ngSubmit"],[1,"mb-3","form-floating"],["type","email","id","usuarioLabel","aria-describedby","emailHelp","formControlName","username","placeholder","Usuario",1,"form-control"],["for","usuarioLabel",1,"form-label"],["type","password","id","passwordLabel","formControlName","password","placeholder","Ingrese su Contrase\xf1a",1,"form-control"],["for","passwordLabel",1,"form-label"],[1,"d-grid","gap-2"],["type","submit",1,"btn","btn-primary","btn-lg","btn-block",3,"disabled"]],template:function(t,r){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"form",3),e.NdJ("ngSubmit",function(){return r.login()}),e.TgZ(4,"div",4),e._UZ(5,"input",5),e.TgZ(6,"label",6),e._uU(7,"Usuario"),e.qZA()(),e.TgZ(8,"div",4),e._UZ(9,"input",7),e.TgZ(10,"label",8),e._uU(11,"Contrase\xf1a"),e.qZA()(),e.TgZ(12,"div",9)(13,"button",10),e._uU(14," Ingresar "),e.qZA()()()()()()),2&t&&(e.xp6(3),e.Q6J("formGroup",r.miFormulario),e.xp6(10),e.Q6J("disabled",r.miFormulario.invalid))},dependencies:[o._Y,o.Fj,o.JJ,o.JL,o.sg,o.u],encapsulation:2}),n})()},{path:"**",redirectTo:"login"}]}];let b=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[l.Bz.forChild(v),l.Bz]}),n})(),M=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[u.ez,b,o.UX]}),n})()}}]);