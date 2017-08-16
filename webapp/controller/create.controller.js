sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast"
	], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("sapui5.demo.odata.controller.create", {
		//Controller Initialisierung
	    onInit : function () {
	    	//Router in privater Variable speichern
	        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	        
	        //Ereignis "Routenmuster gefunden" auf private Funktion _onRouteMatched registrieren
	        this._oRouter.getRoute("toCreate").attachPatternMatched(this._onRouteMatched, this);
		},
		
		
		
		//Routenmuster gefunden
		_onRouteMatched : function (oEvent) {
			//Hole das Model, binde es explizit an das View
			var oModel = this.getOwnerComponent().getModel("T19");
			this.getView().setModel(oModel, "T19");
			
			//Ereignis "Metadaten des Models geladen" auf private Funktion _onMetadataLoaded registrieren
			oModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		
		
		
		//Metadaten des Models erfolgreich geladen
		//ACHTUNG! Erst wenn die Metadaten erfolgreich geladen wurden, kann ein createEntry erfolgen!
		_onMetadataLoaded : function (oEvent){
			var oNewBusinessPartner = {
				Address: {
					City: "Musterstadt",
					PostalCode: "12345",
					Street: "Musterstrasse 1",
					Building: "W24",
					Country: "DE",
					AddressType: "02"
				},
				BusinessPartnerID: "",
				CompanyName: "Musterorganisation",
				WebAddress: "http://www.Mustermanufaktur.de",
				EmailAddress: "info@mustermanufaktur.de",
				PhoneNumber: "12345",
				FaxNumber: "67890",
				LegalForm: "AG",
				CurrencyCode: "EUR",
				BusinessPartnerRole: "02"
			};
			
			//Erstelle neuen Eintrag im Model auf Basis der Vorschlagsdaten
			this._oContext = this.getView().getModel("T19").createEntry("/BusinessPartnerSet", {
				properties: oNewBusinessPartner,
				success: this._onCreateSuccess.bind(this),
				error: this._onCreateError.bind(this)
			});
			
			//Binde den neuen Eintrag an das View
			this.getView().setBindingContext(this._oContext, "T19");
		},
		
		
		
		//Eintrag erfolgreich im Model erzeugt
		_onCreateSuccess: function (oBusinessPartner) {
			//Navigate to the new product's object view
			var sBusinessPartnerID = oBusinessPartner.BusinessPartnerID;
			this._oRouter.navTo("toReadDetail", {
				BusinessPartnerID : sBusinessPartnerID
			}, true);
			
			//Show success message
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("createNewObjectCreated", [oBusinessPartner.CompanyName]);
			
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		
		
		
		//Eintrag nicht im Model erzeugt
		_onCreateError:function(oBusinessPartner){
			//Show error messge
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("createNewObjectError", [oBusinessPartner.CompanyName]);
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});	
		},
		
		
		
		//Button Abbruch
		onCancel: function() {
			this.onNavPress();
		},
		
		

		//Button Speichern
		onSave: function() {
			var oModel = this.getView().getModel("T19");
			//Sende neu erstellen Eintrag aus dem Model in das Backend
			oModel.submitChanges({ 	success: this._onSaveSuccess.bind(this),	//ACHTUNG! Callback Methode wird nur aufgerufen, wenn Batchmodus eingeschaltet ist!
									error: this._onSaveError.bind(this)			//ACHTUNG! Callback Methode wird nur aufgerufen, wenn Batchmodus eingeschaltet ist!
			});
		},
		
		
		
		//Eintrag erfolgreich im Backend gespeichert
		_onSaveSuccess: function (oBusinessPartner) {
			//Unbind the view to not show this object again
			this.getView().unbindObject();
			
			//Show success messge
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("saveNewObjectCreated");
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		
		
		
		//Eintrag nicht im Backend gespeichert
		_onSaveError:function(oBusinessPartner){
			//Show error message
			var sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("saveNewObjectError");
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});	
		},
		
		
		
		//Button History-Navigation
	    onNavPress : function(){ 
	    	//Falls ein neuer Eintrag angelegt wurde, muss dieser zunächst wieder gelöscht werden
	    	this.getView().getModel("T19").deleteCreatedEntry(this._oContext);
	    	
		    var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				window.history.go(-1);
			} else {
				// No Navigation history found, navigate via Route toStart
				this._oRouter.navTo("toStart");
			}
		}
	});
});