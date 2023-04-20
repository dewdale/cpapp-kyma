sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","../model/formatter"],function(e,t,i,n){"use strict";return e.extend("ns.mitigations.controller.Object",{formatter:n,onInit:function(){var e=new t({busy:true,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);this.setModel(e,"objectView")},onNavBack:function(){var e=i.getInstance().getPreviousHash();if(e!==undefined){history.go(-1)}else{this.getRouter().navTo("worklist",{},true)}},_onObjectMatched:function(e){var t=e.getParameter("arguments").objectId;this._bindView("/Mitigations"+t)},_bindView:function(e){var t=this.getModel("objectView");this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){t.setProperty("/busy",true)},dataReceived:function(){t.setProperty("/busy",false)}}})},_onBindingChange:function(){var e=this.getView(),t=this.getModel("objectView"),i=e.getElementBinding();if(!i.getBoundContext()){this.getRouter().getTargets().display("objectNotFound");return}var n=this.getResourceBundle(),o=e.getBindingContext().getObject(),s=o.ID,a=o.Mitigations;t.setProperty("/busy",false);t.setProperty("/shareSendEmailSubject",n.getText("shareSendEmailObjectSubject",[s]));t.setProperty("/shareSendEmailMessage",n.getText("shareSendEmailObjectMessage",[a,s,location.href]))}})});