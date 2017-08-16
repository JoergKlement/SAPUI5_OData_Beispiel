sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (Controller, History, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sapui5.demo.odata.controller.read", {
		
		//Initialisierung
	    onInit : function () {
	    	this._oSelectedBusinessPartner = {};													//privates Attribut für selektierten Geschäftspartner
	    	this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();	//privates Attribut für Ressourcenbündel
	        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);								//privates Attribut für Router
			this._oRouter.getRoute("toRead").attachPatternMatched(this._onRouteMatched, this);
		},
		
		
		//Routenmuster gefunden
		_onRouteMatched : function (oEvent) {
			//Keinerlei Arbeiten notwendig - Binding zum Entitätenset BusinessPartnerSet 
			//erfolgt durch Aggregation-Binding Angabe zum Attribut "items" im Table-Tag
		},
		
		
		//Navigiere zur Detailsicht
		onLineSelect : function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oBusinessPartnerItem = oEvent.getSource();
		    oRouter.navTo("toReadDetail", { 
				BusinessPartnerID: oBusinessPartnerItem.getBindingContext("T19").getProperty("BusinessPartnerID")
		    });
		},
		
		
		//Hinzufügen Button in Toolbar
		onAdd : function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("toCreate");
		},
		
		
		//Filtern auf Tabelle
		onSearch : function(oEvent){
			//Erzeuge Filterarray, hole Suchfeldinhalt und das Binding der Tabelle
			var aFilter = [],
                sQuery = oEvent.getParameter("query"),
                oBusinessPartnerTable = this.getView().byId("BusinessPartnerTable"),
                oBinding = oBusinessPartnerTable.getBinding("items");
             
            if(sQuery) {
            	//Erzeuge Einzelfilter
            	var oFilterCompanyName = new Filter("CompanyName", FilterOperator.Contains, sQuery);
            	var oFilterBusinessPartnerID = new Filter("BusinessPartnerID", FilterOperator.Contains, sQuery);
            	var oFilterCity = new Filter("Address/City", FilterOperator.Contains, sQuery);
            	var oFilterStreet = new Filter("Address/Street", FilterOperator.Contains, sQuery);
            	
            	//Sammle alle Einzelfilter in einen Gesamtfilter mit einer OR Verknüpfung (and = false)
            	var	oFilterAll = new Filter({
            		filters: [oFilterCompanyName, oFilterBusinessPartnerID, oFilterCity, oFilterStreet],
            		and: false
            	});
            	//Füge Gesamtfilter zum Filterarray hinzu
            	aFilter.push(oFilterAll);
            }
            //Sende Filteranfrage an Binding und somit an OData Webservice
            oBinding.filter(aFilter);
		},
		
		

		
		//Navigation über Shell-Navigationsbutton
	    onNavPress : function(){ 
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