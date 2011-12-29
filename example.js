Ext4.onReady(function() {

    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        maxResolution: 156543.033928041,
        maxExtent: new OpenLayers.Bounds(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892)
    }

    var map = new OpenLayers.Map('mappanel',options)
    var l1 = new OpenLayers.Layer.WMS("t1", "http://oceanviewer.ru/eko/wms", {layers: "eko_merge"})
    var layers = []
    for(i=1; i<=6; i++){
        layers.push(new OpenLayers.Layer.WMS("w" + i, "http://oceanviewer.ru/resources/wms", {layers: "ru_hydrometcentre_42:ru_hydrometcentre_42_" + i}, {isBaseLayer: false, visibility: false}))
    }

    map.addLayer(l1)
    map.addLayers(layers)

    map.addControl(new OpenLayers.Control.LayerSwitcher())

    var pricker = new GeoExt.Pricker({
         map: map
        ,layers: layers //adding layers
        ,aliaseUrl: '/OceanViewer2/translate'
        ,getInfoUrl: '/resources/wms'
        ,nameTitleAlias: 'назв.слоя'
        //,buffer: 0
        ,chartOptions: {
                title: 'Графики'
                ,fieldComboName1: 'В-те знач. по X'
                //,fieldComboName2...
                //,typeComboName...
                //,defaultAxisTitle1...
                //,defaultAxisTitle2...
            }
    })

    map.setCenter(new OpenLayers.LonLat(13306157, 5119446),5)

    //var mapPanel = new GeoExt.MapPanel({
        //renderTo: "mappanel",
        //height: 400,
        //width: 600,
        //map: map,
        ////center: new OpenLayers.LonLat(5, 45),
        //zoom: 4
    //})

})
