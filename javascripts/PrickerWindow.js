/**
 * Copyright TODO
 */

/** api: (define)
 *  module = GeoExt
 *  class = Pricker
 *  base_link = `Ext.Window <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Window>`_
 */


Ext4.namespace("GeoExt");

/** api: example
 *  Sample code to create a popup:
 * 
 *  .. code-block:: javascript
 *
 *      var prickerWindow = new Ext4.create('GeoExt.PrickerWindow', {
 *               chartField1: field1
 *              ,chartField2: field2
 *              ,chartAliases: aliases
 *              ,fieldsAxisType: type
 *          }
 */

/** api: constructor
 *  .. class:: Pricker(config)
 *
 *      PrickerWindow are a specialized Window that showing charts.
 *      Used by Pricker instnce.
 */
Ext4.define('GeoExt.PrickerWindow', {
    /** api: config[extend]
     *  ``String``  extend from ``Ext.Window``.
     */
     extend: 'Ext.Window'

    /** api: config[width]
     *  ``Integer`` Default window width.
     */
    ,width: 800

    /** api: config[height]
     *  ``Integer`` Default window height.
     */
    ,height: 400

    ,shadow: false

    ,maximizable: true

    // Begin i18n
    ,title: locale.pricker.title
	,baseTitle: locale.pricker.baseTitle
	,getDataErrorText: locale.pricker.getDataErrorText
	,defaultErrorHeader: locale.pricker.defaultErrorHeader
    ,fieldComboName1: locale.pricker.fieldComboName1
    ,fieldComboName2: locale.pricker.fieldComboName2
    ,defaultAxisTitle1: locale.pricker.defaultAxisTitle1
    ,defaultAxisTitle2: locale.pricker.defaultAxisTitle2
    ,typeComboName: locale.pricker.typeComboName
    ,addText: locale.pricker.addText
    ,deleteText: locale.pricker.deleteText
    ,saveText: locale.pricker.saveText
    ,addLayerWinTitle: locale.pricker.addLayerWinTitle
    ,canselText: locale.pricker.canselText
    ,okText: locale.pricker.okText
    ,layerName: locale.pricker.layerName
    // End i18n.

    //,renderTo: Ext.getBody()

    /** api: config[chartAliases]
     *  ``Object`` Hash with aliases for axis title.
     */
    ,chartAliases: {}

    /** api: config[chartField1]
     *  ``String`` Selected fireld for axis1.
     */
    ,chartField1: ''

    /** api: config[chartField2]
     *  ``String`` Selected fireld for axis2.
     */
    ,chartField2: ''

    /** api: config[chartType]
     *  ``String`` Default chart type.
     */
    ,chartType: 'line'

    ,closeAction: 'hide'

    ,initComponent: function() {
      //this.editing = Ext4.create('Ext.grid.plugin.CellEditing')

          Ext4.apply(this, {

            tbar:[
                    {xtype: 'panel'
					 ,id: 'prickerMainPanel'
                     ,flex: 1
                     ,frame : false
                     ,border: false
                     ,bodyStyle: 'background:transparent'
                     ,items:[
                       {xtype: 'panel'
                       ,frame : false
					   ,id: 'prickerChildPanel'
                       ,border: false
                       ,bodyStyle: 'background:transparent'
                       ,layout: 'column'
                       ,items:[
                             {xtype: 'combo',
                                 store: Ext4.create('Ext.data.Store', { fields: ['id', 'name'] })
                                ,id: 'field_x'
                                ,queryMode: 'local'
                                ,displayField: 'name'
                                ,valueField: 'id'
                                }
                            ,{xtype: 'combo',
                                 store: Ext4.create('Ext.data.Store', { fields: ['id', 'name'] })
                                ,id: 'field_y'
                                ,queryMode: 'local'
                                ,displayField: 'name'
                                ,valueField: 'id'
                                }
                            ,{xtype: 'combo',
                                 store: Ext4.create('Ext.data.Store', { fields: ['id', 'name'] })
                                ,id: 'chart_type'
                                ,queryMode: 'local'
                                ,displayField: 'name'
                                ,valueField: 'id'
                                }
                          ]}
                      ]
                  }
                ]

            ,layout: {
                type: 'hbox',
				id: 'prickerHboxLayout',
                pack: 'start',
                align: 'stretch'
            }
            ,items: [
              
            ]
        })



            this.callParent(arguments)
            Ext4.getCmp('field_x').on('select', this.xFieldSelect, this )
            Ext4.getCmp('field_x').fieldLabel = this.fieldComboName1
            Ext4.getCmp('field_y').on('select', this.yFieldSelect, this )
            Ext4.getCmp('field_y').fieldLabel = this.fieldComboName2
            Ext4.getCmp('chart_type').on('select', this.typeSelect, this )
            Ext4.getCmp('chart_type').fieldLabel = this.typeComboName

          
        }


	,lastUpdate: null
		
    ,prepareChartFields: function() {

		var source = new gxp.plugins.ChartSource();
		source.init();
		
		var lastUpdate = source.getLastUpdate();
	
		var record = source.getDefaultChart();
		
		if (record) 
		
		{
			this.setTitle(this.baseTitle+": "+record.name);
			try {
			
				if(this.pricker.chartField1) { this.chartField1 = this.pricker.chartField1; this.pricker.chartField1=null }
				else if ((!this.chartField1) || (this.lastUpdate!=lastUpdate))  { 
												var idx = -1;
												if (record) {
													for (var i=0;i<this.pricker.fieldXStoreData.length;i++) {
														if (this.pricker.fieldXStoreData[i].id == record.x_axis)
															idx = i;
													}
												}
												this.chartField1 = idx!=-1?this.pricker.fieldXStoreData[idx].id:this.pricker.fieldXStoreData[0].id
												Ext4.getCmp('field_x').setValue(idx!=-1?this.pricker.fieldXStoreData[idx].name:this.pricker.fieldXStoreData[0].name)
												//this.lastUpdate=lastUpdate
											}

				if(this.pricker.chartField2) { this.chartField2 = this.pricker.chartField2; this.pricker.chartField2=null }
				else if ((!this.chartField2)  || (this.lastUpdate!=lastUpdate))  { 
												var idx = -1;
												if (record) {
													for (var i=0;i<this.pricker.fieldYStoreData.length;i++) {
														if (this.pricker.fieldYStoreData[i].id == record.y_axis)
															idx = i;
													}
												}
												this.chartField2 = idx!=-1?this.pricker.fieldYStoreData[idx].id:this.pricker.fieldYStoreData[0].id
												Ext4.getCmp('field_y').setValue(idx!=-1?this.pricker.fieldYStoreData[idx].name:this.pricker.fieldYStoreData[0].name)
												this.lastUpdate=lastUpdate
											}
			}
			catch(e) {
				gxp.plugins.Logger.log("Ошибка при построении графика: " + this.getDataErrorText , gxp.plugins.Logger.prototype.LOG_LEVEL_NETWORK_LOCAL_ERRORS);
				//	Ext.Msg.alert(this.defaultErrorHeader, this.getDataErrorText);
			}
		}
		else {
			Ext.Msg.alert(this.defaultErrorHeader, this.errorText);
			gxp.plugins.Logger.log("Ошибка при построении графика: " + this.errorText, gxp.plugins.Logger.prototype.LOG_LEVEL_NETWORK_LOCAL_ERRORS);
			return false;
		}
        if(this.pricker.chartType) { this.chartType = this.pricker.chartType; this.pricker.chartType=null }
        else if(!this.chartType) {
									this.chartType = this.pricker.typeStoreData[0].id
									Ext4.getCmp('chart_type').setValue(this.pricker.typeStoreData[0].name)
								}
		else {
				var value = "";				
				for (var i=0; i<this.pricker.typeStoreData.length; i++) {
					if (this.pricker.typeStoreData[i].id==this.chartType) {
						value = this.pricker.typeStoreData[i].name;
					}
				}
							
				Ext4.getCmp('chart_type').setValue(value);
				
		}

        s = Ext4.Array.map(this.pricker.chartStoreData,function(el,i){
            return el[this.chartField1]
          },this)
        if(s.length > Ext4.Array.unique(s).length){
            Ext4.Array.each(this.pricker.chartStoreData,function(el,i){
                return this.pricker.chartStoreData[i][this.chartField1] = el[this.chartField1] + '_' + i
              },this)
          }
		return true;
      }

    ,prepareChartStores: function() {

        this.chartStore = Ext4.create('Ext.data.JsonStore', { fields: this.pricker.chartStoreFields } )
        this.chartStore.loadData(this.pricker.chartStoreData)
      }

    ,prepareComboStores: function() {
        Ext4.getCmp('field_x').store.loadData(this.pricker.fieldXStoreData)
        Ext4.getCmp('field_y').store.loadData(this.pricker.fieldYStoreData)
        Ext4.getCmp('chart_type').store.loadData(this.pricker.typeStoreData)
      }



    /** api: method[chartType]
     *  Show chart window
     */
    ,show: function() {
            if (!this.setChart()) return
            this.callParent(arguments)
        }

    /** private: method[chartAxes]
     *  :param type: ``String``
     *  :param field1: ``String``
     *  :param field2: ``String``
     *  :return ``Object``
     *  Return options for initialize Chart
     */
    ,chartAxes: function(type,field1,field2){
        var title1 = this.defaultAxisTitle1
        if(this.pricker.chartAliases[field1]) title1=this.pricker.chartAliases[field1]
        var title2 = this.defaultAxisTitle2
        if(this.pricker.chartAliases[field2]) title2=this.pricker.chartAliases[field2]

        var axisType1 = 'Category'
        if(this.pricker.fieldsAxisType[field1]) axisType1=this.pricker.fieldsAxisType[field1]
        var axisType2 = 'Numeric'
        if(this.pricker.fieldsAxisType[field2]) axisType2=this.pricker.fieldsAxisType[field2]

        //var values = Ext4.Array.map(this.pricker.chartStoreData,function(el,i){return el[field2]})
        //,sorted_values = Ext4.Array.sort(values,function(a,b){return a > b})[0]
        return [
                {
                     type: axisType1
                    ,position: 'bottom'
                    ,fields: [field1]
                    ,title: title1
                    ,label: {
                        font: '10px Arial'
                        //rotate: {
                                //degrees: -20
                            //}
                      }
                }
                ,{
                     type: axisType2
                    //,minimum: sorted_values[0]
                    //,maximum: sorted_values[sorted_values.length - 1]
                    ,grid: {
                        odd: {
                            opacity: 1,
                            fill: '#ddd',
                            stroke: '#bbb',
                            'stroke-width': 0.5
                        }
                    }
                    ,position: 'left'
                    ,fields: [field2]
                    ,title: title2
                }
            ]
        }

    /** private: method[chartSeries]
     *  :param type: ``String``
     *  :param field1: ``String``
     *  :param field2: ``String``
     *  :return ``Object``
     *  Return options for initialize Chart
     */
    ,chartSeries: function(type,field1,field2){

            var common = {
                 type: type
                ,highlight: false
                ,axis: 'left'
                ,xField: field1
                ,yField: field2
            }

            if (type == 'line' ) {
              common.smooth = 3
              common.label = {
                field: field2
              }
              common.highlight = true
              common.tips = { 
                trackMouse: true, 
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get(field2))
                  }
              }
            }

            if (type == 'column' ) {
                common.label = {
                  contrast: true,
                  display: 'insideEnd',
                  field: field2,
                  color: '#000',
                  orientation: 'vertical',
                  'text-anchor': 'middle'
                }
            }

            if (type == 'area' ) {
              common.style = { opacity: 0.5 }
              common.label = {
                field: field2
              }
              common.tips = {
                trackMouse: true,
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get(field2))
                  }
              }
              common.highlight = true
            }

            return [common]
        }

    /** private: method[chartOptions]
     *  :param type: ``String``
     *  :param field1: ``String``
     *  :param field2: ``String``
     *  :return ``Object``
     *  Return options for initialize Chart
     */
    ,chartOptions: function(type,field1,field2) {
            var common = {
                id: 'chart'
                ,flex: 1
                ,animate: true
                ,style: 'background:#fff'
                ,store: this.chartStore
                ,axes: this.chartAxes(type,field1,field2)
                ,series: this.chartSeries(type,field1,field2)
            }
            if (type == 'line') common.theme = 'Red'
            if (type == 'area') common.theme = 'Blue'
            if (type == 'column') common.theme = 'Sky'
            return common
        }

		
    /** api: method[setChart]
     *  Iitialize Chart
     */
    ,setChart: function() {

			if(Ext4.getCmp('chart')){
              this.remove(Ext4.getCmp('chart'))
            }
	
            if (!this.prepareChartFields()) { return false }
            this.prepareChartStores()
            this.prepareComboStores()

            

            var chart = Ext4.create('Ext.chart.Chart', this.chartOptions(this.chartType, this.chartField1, this.chartField2))
			//if (this.pricker.chartStoreFields.length==0) { Ext.Msg.alert(this.defaultErrorText, this.getDataErrorText); return false; } 
			this.add(chart)
			return true
        }

	,isValid: function() {
		return (this.pricker.chartStoreFields.length>0);
	}

    /** private: method[typeSelect]
     *  Type combobox callback on select.
     */
    ,typeSelect: function(combo,e) {
            this.chartType = e[0].data.id
            this.setChart()
        }

    /** private: method[typeSelect]
     *  Combobox1 callback on select.
     */
    ,xFieldSelect: function(combo,e) {
            this.chartField1 = e[0].data.id
            this.setChart()
        }

    /** private: method[typeSelect]
     *  Combobox2 callback on select.
     */
    ,yFieldSelect: function(combo,e) {
            this.chartField2 = e[0].data.id
            this.setChart()
        }

})
