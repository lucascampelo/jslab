(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["8711bb46"],{"539b":function(e,t,r){},"579a":function(e,t,r){"use strict";var s=r("539b"),a=r.n(s);a.a},c93f:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("q-page",{attrs:{padding:""}},[r("div",{staticClass:"row"},[r("div",{staticClass:"col text-center"},[r("q-btn",{attrs:{color:"primary"},on:{click:function(t){e.streamStarted?e.stopVideo():e.startVideo()}}},[r("q-icon",{attrs:{name:"videocam"}}),r("span",{staticClass:"q-ml-md",domProps:{textContent:e._s(e.streamStarted?"Parar WebCam":"Iniciar WebCam")}})],1)],1)]),r("div",{staticClass:"row q-mt-md"},[r("div",{staticClass:"col text-center"},[e.errorMessage?r("div",{staticClass:"inline-block bg-negative text-white q-py-sm q-px-lg rounded-borders",domProps:{textContent:e._s(e.errorMessage)}}):e._e()])]),r("div",{staticClass:"row flex-center q-mt-lg"},[e.qrCodeResult?r("div",{staticClass:"qrcode-result text-center"},[r("p",[e._v("Resultado:")]),r("p",{domProps:{textContent:e._s(e.qrCodeResult)}})]):e._e(),r("div",{staticClass:"video-wrapper",class:{active:e.streamStarted},staticStyle:{width:"640px",height:"480px"}},[r("video",{attrs:{id:"video",width:"100%",height:"100%",autoplay:"",muted:""},domProps:{muted:!0}}),r("div",{staticClass:"qrcode-aim"})])])])},a=[],o=r("967e"),n=r.n(o),i=(r("7f7f"),r("8993")),c=r.n(i),d=(r("96cf"),r("fa84")),l=r.n(d),u=r("1634"),m=r("f058");u["a"].WORKER_PATH=m["a"];var p={name:"QrCode",data:function(){return{streamStarted:!1,errorMessage:null,video:null,stream:null,qrScanner:null,qrCodeResult:null}},mounted:function(){this.video=this.$el.querySelector("#video")},methods:{startVideo:function(){var e=l()(n.a.mark((function e(){var t,r,s=this;return n.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.errorMessage=null,this.qrCodeResult=null,t={video:{facingMode:{exact:"environment"}}},r=navigator.mediaDevices.getUserMedia(t),e.next=6,r.then((function(e){s.video.srcObject=s.stream=e;var t=e.getVideoTracks()[0].getSettings(),r=t.width,a=t.height;s.video.parentElement.style.width="".concat(r,"px"),s.video.parentElement.style.height="".concat(a,"px"),s.streamStarted=!0,s.qrScanner=new u["a"](s.video,(function(e){return s.setResult(e)})),s.qrScanner.start()})).catch((function(e){switch(console.error(e,c()(e)),e.name){case"NotFoundError":case"DevicesNotFoundError":s.errorMessage="WebCam não encontrada.";break;case"NotReadableError":case"TrackStartError":s.errorMessage="WebCam já está em uso.";break;case"OverconstrainedError":case"ConstraintNotSatisfiedError":s.errorMessage="Configurações não suportadas no dispositivo.";break;case"NotAllowedError":case"PermissionDeniedError":s.errorMessage="Permissão negada pelo usuário.";break;default:s.errorMessage=" Um erro inexperado ocorreu (".concat(e.name,": ").concat(e.message,").");break}}));case 6:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),stopVideo:function(){this.qrScanner&&(this.qrScanner.destroy(),this.qrScanner=null),this.stream&&(this.stream.getTracks().forEach((function(e){return e.stop()})),this.stream=null),this.video.srcObject=null,this.streamStarted=!1},setResult:function(e){this.qrCodeResult=e,this.stopVideo()}},beforeDestroy:function(){this.stopVideo()}},h=p,v=(r("579a"),r("2877")),f=r("eebe"),g=r.n(f),b=r("9989"),C=r("9c40"),q=r("0016"),w=Object(v["a"])(h,s,a,!1,null,"fd55b1ca",null);t["default"]=w.exports;g()(w,"components",{QPage:b["a"],QBtn:C["a"],QIcon:q["a"]})}}]);