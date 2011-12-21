Ext4.define('GeoExt.PrickerWindow', {
     extend: 'Ext.Window'
    ,width: 800
    ,height: 400
    ,shadow: false
    //,maximizable: true
    ,title: 'Area Chart'
    ,renderTo: Ext4.getBody()
    ,layout: 'fit'

    ,initComponent: function() {
        this.callParent(arguments)
        this.chartType = 'area'
        this.chartField1 = 'name'
        this.chartField2 = 'data1'
        this.setChart()

        this.addDocked(Ext4.create('Ext.form.ComboBox', {
                fieldLabel: 'Choose X field'
                ,store: FieldStore
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                ,listeners: {
                         scope: this
                        ,select: this.xFieldSelect
                    }
            }),'top')
        this.addDocked(Ext4.create('Ext.form.ComboBox', {
                fieldLabel: 'Choose Y field'
                ,store: FieldStore
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                ,listeners: {
                         scope: this
                        ,select: this.yFieldSelect
                    }
            }),'top')
        this.addDocked(Ext4.create('Ext.form.ComboBox', {
                fieldLabel: 'Choose type'
                ,store: TypeStore
                ,queryMode: 'local'
                ,displayField: 'name'
                ,valueField: 'id'
                ,listeners: {
                         scope: this
                        ,select: this.typeSelect
                    }
            }),'top')

    }

    ,chartAxes: function(type,field1,field2){
        return [{
             type: 'Numeric'
            ,grid: true
            ,position: 'left'
            ,fields: [field2]
            ,title: 'Field Name' //TODO get aliase name for field
            ,grid: {
                    odd: {
                        opacity: 1,
                        fill: '#ddd',
                        stroke: '#bbb',
                        'stroke-width': 1
                    }
                }
            ,minimum: 0
            ,adjustMinimumByMajorUnit: 0
        }, {
             type: 'Category'
            ,position: 'bottom'
            ,fields: [field1]
            ,title: 'Field Name' //TODO get aliase name for field
            ,grid: true
            ,label: {
                    rotate: {
                        degrees: 315
                    }
                }
        }]

    }

    ,chartSeries: function(type,field1,field2){
            return [{
                 type: type
                ,highlight: false
                ,axis: 'left'
                ,xField: field1
                ,yField: field2
                ,style: {
                        opacity: 0.93
                    }
            }]
        }

    ,chartOptions: function(type,field1,field2) {
            return {
                     style: 'background:#fff'
                    ,animate: true
                    ,store: ChartStore
                    ,legend: {
                            position: 'bottom'
                        }
                    ,axes: this.chartAxes(type,field1,field2)
                    ,series: this.chartSeries(type,field1,field2)
                }
        }

    ,setChart: function() {
            this.removeAll(true)
            this.add(Ext4.create('Ext.chart.Chart', this.chartOptions(this.chartType, this.chartField1, this.chartField2)))
        }

    //newChartFrom: function(name)
        //{
            //this.newChartOptions = this.chartOptions[name].dup()
        //},

    //setCustomParam: function(name)
        //{
            //[>this.newChartOptions[param] = ... <]
        //},

    ,saveNewChart: function() { /*...*/ }

    ,loadCharts: function() { /*...*/ }

    ,typeSelect: function(combo,e) {
            this.chartType = e[0].data.id
            this.setChart()
        }

    ,xFieldSelect: function(combo,e) {
            this.chartField1 = e[0].data.id
            this.setChart()
        }

    ,yFieldSelect: function(combo,e) {
            this.chartField2 = e[0].data.id
            this.setChart()
        }

})