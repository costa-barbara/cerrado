var bioma = "CERRADO";
var file_in = bioma + '_col6_wetlands_gapfill_incid_v53';

var dirout = 'projects/mapbiomas-workspace/COLECAO6/classificacao-test/';
var version_out = 53;
var file_out = bioma + '_col6_wetlands_gapfill_incid_temporal_v';

var palettes = require('users/mapbiomas/modules:Palettes.js');

var vis = {
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

var image_gapfill = ee.Image(dirout + file_in)
                      .slice(0, 36)
                      .aside(print);
                      
var mask3 = function(valor, ano, imagem){
  var mask = imagem.select('classificationWet_'+ (parseInt(ano) - 1)).eq (valor)
        .and(imagem.select('classificationWet_'+ (ano)              ).neq(valor))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 1)).eq (valor))
  var muda_img = imagem.select('classificationWet_'+ (ano)    ).mask(mask.eq(1)).where(mask.eq(1), valor);  
  var img_out = imagem.select('classificationWet_'+ano).blend(muda_img)
  return img_out;
}

var mask4 = function(valor, ano, imagem){
  var mask = imagem.select('classificationWet_'+ (parseInt(ano) - 1)).eq (valor)
        .and(imagem.select('classificationWet_'+ (ano)              ).neq(valor))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 1)).neq(valor))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 2)).eq (valor))
  var muda_img  = imagem.select('classificationWet_'+ (ano)              ).mask(mask.eq(1)).where(mask.eq(1), valor);  
  var muda_img1 = imagem.select('classificationWet_'+ (parseInt(ano) + 1)).mask(mask.eq(1)).where(mask.eq(1), valor); 
  var img_out = imagem.select('classificationWet_'+ano).blend(muda_img).blend(muda_img1)
  return img_out;
}

var mask5 = function(valor, ano, imagem){
  var mask = imagem.select('classificationWet_'+ (parseInt(ano) - 1)).eq (valor)
        .and(imagem.select('classificationWet_'+ (ano)              ).neq(valor))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 1)).neq(valor))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 2)).neq(valor))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 3)).eq (valor))
  var muda_img  = imagem.select('classificationWet_'+ (ano)              ).mask(mask.eq(1)).where(mask.eq(1), valor);  
  var muda_img1 = imagem.select('classificationWet_'+ (parseInt(ano) + 1)).mask(mask.eq(1)).where(mask.eq(1), valor);  
  var muda_img2 = imagem.select('classificationWet_'+ (parseInt(ano) + 2)).mask(mask.eq(1)).where(mask.eq(1), valor);  
  var img_out = imagem.select('classificationWet_'+ano).blend(muda_img).blend(muda_img1).blend(muda_img2)
  return img_out;
}
var anos3 = ['1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017', '2018', '2019'];
var anos4 = ['1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016', '2017', '2018'];
var anos5 = ['1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015', '2016', '2017'];

var window5years = function(imagem, valor){
   var img_out = imagem.select('classificationWet_1985')
   for (var i_ano=0;i_ano<anos5.length; i_ano++){  
     var ano = anos5[i_ano];  
     img_out = img_out.addBands(mask5(valor,ano, imagem)) }
     img_out = img_out.addBands(imagem.select('classificationWet_2018'))
     img_out = img_out.addBands(imagem.select('classificationWet_2019'))
     img_out = img_out.addBands(imagem.select('classificationWet_2020'))
   return img_out
}

var window4years = function(imagem, valor){
   var img_out = imagem.select('classificationWet_1985')
   for (var i_ano=0;i_ano<anos4.length; i_ano++){  
     var ano = anos4[i_ano];  
     img_out = img_out.addBands(mask4(valor,ano, imagem)) }
     img_out = img_out.addBands(imagem.select('classificationWet_2019'))
     img_out = img_out.addBands(imagem.select('classificationWet_2020'))
   return img_out
}

var window3years = function(imagem, valor){
   var img_out = imagem.select('classificationWet_1985')
   for (var i_ano=0;i_ano<anos3.length; i_ano++){  
     var ano = anos3[i_ano];   
     img_out = img_out.addBands(mask3(valor,ano, imagem)) }
     img_out = img_out.addBands(imagem.select('classificationWet_2020'))
   return img_out
}

var mask4valores = function(valor, ano, imagem){
  var mask = imagem.select('classificationWet_'+ (parseInt(ano) - 1)).eq(valor[0])
        .and(imagem.select('classificationWet_'+ (ano)              ).eq(valor[1]))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 1)).eq(valor[2]))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 2)).eq(valor[3]))
  var muda_img  = imagem.select('classificationWet_'+ (ano)              ).mask(mask.eq(1)).where(mask.eq(1), valor[4]);  
  var muda_img1 = imagem.select('classificationWet_'+ (parseInt(ano) + 1)).mask(mask.eq(1)).where(mask.eq(1), valor[4]); 
  var img_out = imagem.select('classificationWet_'+ano).blend(muda_img).blend(muda_img1)
  return img_out;
}

var mask3valores = function(valor, ano, imagem){
  var mask = imagem.select('classificationWet_'+ (parseInt(ano) - 1)).eq(valor[0])
        .and(imagem.select('classificationWet_'+ (ano)              ).eq(valor[1]))
        .and(imagem.select('classificationWet_'+ (parseInt(ano) + 1)).eq(valor[2]))
  var muda_img = imagem.select('classificationWet_'+ (ano)    ).mask(mask.eq(1)).where(mask.eq(1), valor[3]);  
  var img_out = imagem.select('classificationWet_'+ano).blend(muda_img)
  return img_out;
}

var window4valores = function(imagem, valor){
   var img_out = imagem.select('classificationWet_1985')
   for (var i_ano=0;i_ano<anos4.length; i_ano++){  
     var ano = anos4[i_ano];  
     img_out = img_out.addBands(mask4valores(valor,ano, imagem)) }
     img_out = img_out.addBands(imagem.select('classificationWet_2020'))
     img_out = img_out.addBands(imagem.select('classificationWet_2019'))
   return img_out
}

var window3valores = function(imagem, valor){
   var img_out = imagem.select('classificationWet_1985')
   for (var i_ano=0;i_ano<anos3.length; i_ano++){  
     var ano = anos3[i_ano];   
     img_out = img_out.addBands(mask3valores(valor,ano, imagem)) }
     img_out = img_out.addBands(imagem.select('classificationWet_2020'))
   return img_out
}

//put "classification_2018 in the end of bands after gap fill
var original = image_gapfill.select('classificationWet_1985')
for (var i_ano=0;i_ano<anos3.length; i_ano++){  
  var ano = anos3[i_ano]; 
  original = original.addBands(image_gapfill.select('classificationWet_'+ano)) 
}
original = original.addBands(image_gapfill.select('classificationWet_2020')).aside(print)


var filtered = original

//var ordem_exec = [33, 29, 12, 13,  3,  4, 21]; var version_out = '2'
//var ordem_exec = [33, 29, 12, 13,  4,  3, 21]; var version_out = '3'
//var ordem_exec = [33, 29,  3, 21, 12, 13,  4]; var version_out = '4'
//var ordem_exec = [33, 21,  3, 29, 12, 13,  4]; var version_out = '5'


var mask3first = function(valor, imagem){
  var mask = imagem.select('classificationWet_1985').neq (valor)
        .and(imagem.select('classificationWet_1986').eq(valor))
        .and(imagem.select('classificationWet_1987').eq (valor))
  var muda_img = imagem.select('classificationWet_1985').mask(mask.eq(1)).where(mask.eq(1), valor);  
  var img_out = imagem.select('classificationWet_1985').blend(muda_img)
  img_out = img_out.addBands([imagem.select('classificationWet_1986'),
                              imagem.select('classificationWet_1987'),
                              imagem.select('classificationWet_1988'),
                              imagem.select('classificationWet_1989'),
                              imagem.select('classificationWet_1990'),
                              imagem.select('classificationWet_1991'),
                              imagem.select('classificationWet_1992'),
                              imagem.select('classificationWet_1993'),
                              imagem.select('classificationWet_1994'),
                              imagem.select('classificationWet_1995'),
                              imagem.select('classificationWet_1996'),
                              imagem.select('classificationWet_1997'),
                              imagem.select('classificationWet_1998'),
                              imagem.select('classificationWet_1999'),
                              imagem.select('classificationWet_2000'),
                              imagem.select('classificationWet_2001'),
                              imagem.select('classificationWet_2002'),
                              imagem.select('classificationWet_2003'),
                              imagem.select('classificationWet_2004'),
                              imagem.select('classificationWet_2005'),
                              imagem.select('classificationWet_2006'),
                              imagem.select('classificationWet_2007'),
                              imagem.select('classificationWet_2008'),
                              imagem.select('classificationWet_2009'),
                              imagem.select('classificationWet_2010'),
                              imagem.select('classificationWet_2011'),
                              imagem.select('classificationWet_2012'),
                              imagem.select('classificationWet_2013'),
                              imagem.select('classificationWet_2014'),
                              imagem.select('classificationWet_2015'),
                              imagem.select('classificationWet_2016'),
                              imagem.select('classificationWet_2017'),
                              imagem.select('classificationWet_2018'),
                              imagem.select('classificationWet_2019'),
                              imagem.select('classificationWet_2020')]);
  return img_out;
};

filtered = mask3first(11, filtered)
filtered = mask3first(12, filtered)
filtered = mask3first(4, filtered)
filtered = mask3first(3, filtered)
filtered = mask3first(15, filtered)
//print(filtered)

var mask3last = function(valor, imagem){
  var mask = imagem.select('classificationWet_2018').eq (valor)
        .and(imagem.select('classificationWet_2019').eq(valor))
        .and(imagem.select('classificationWet_2020').neq (valor))
  var muda_img = imagem.select('classificationWet_2019').mask(mask.eq(1)).where(mask.eq(1), valor);  
  var img_out = imagem.select('classificationWet_1985')
  img_out = img_out.addBands([imagem.select('classificationWet_1986'),
                              imagem.select('classificationWet_1987'),
                              imagem.select('classificationWet_1988'),
                              imagem.select('classificationWet_1989'),
                              imagem.select('classificationWet_1990'),
                              imagem.select('classificationWet_1991'),
                              imagem.select('classificationWet_1992'),
                              imagem.select('classificationWet_1993'),
                              imagem.select('classificationWet_1994'),
                              imagem.select('classificationWet_1995'),
                              imagem.select('classificationWet_1996'),
                              imagem.select('classificationWet_1997'),
                              imagem.select('classificationWet_1998'),
                              imagem.select('classificationWet_1999'),
                              imagem.select('classificationWet_2000'),
                              imagem.select('classificationWet_2001'),
                              imagem.select('classificationWet_2002'),
                              imagem.select('classificationWet_2003'),
                              imagem.select('classificationWet_2004'),
                              imagem.select('classificationWet_2005'),
                              imagem.select('classificationWet_2006'),
                              imagem.select('classificationWet_2007'),
                              imagem.select('classificationWet_2008'),
                              imagem.select('classificationWet_2009'),
                              imagem.select('classificationWet_2010'),
                              imagem.select('classificationWet_2011'),
                              imagem.select('classificationWet_2012'),
                              imagem.select('classificationWet_2013'),
                              imagem.select('classificationWet_2014'),
                              imagem.select('classificationWet_2015'),
                              imagem.select('classificationWet_2016'),
                              imagem.select('classificationWet_2017'),
                              imagem.select('classificationWet_2018'),
                              imagem.select('classificationWet_2019')]);
  var img_out = img_out.addBands(imagem.select('classificationWet_2020').blend(muda_img))
  return img_out;
}

filtered = mask3last(19, filtered)
filtered = mask3last(15, filtered)
print(filtered)


//regras especificas do Pantanal]
// regras de campo umido
filtered = window4valores(filtered, [11, 12, 12, 12, 12]) // evita que campo entre como area umida
filtered = window4valores(filtered, [12, 11, 11, 11, 11]) // evita que area umida entre como campo 

filtered = window4valores(filtered, [3, 12, 12, 12, 15])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [3, 12, 12, 15, 15])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [3, 12, 12, 12, 19])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [3, 12, 12, 19, 19])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [4, 12, 12, 12, 15])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [4, 12, 12, 15, 15])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [4, 12, 12, 12, 19])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [4, 12, 12, 19, 19])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [19, 19, 12, 12, 12])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window4valores(filtered, [19, 19, 19, 12, 12])  //converte desmatamento de floresta para agro ao invés de campo
filtered = window3valores(filtered, [19, 19, 12, 12])
filtered = window3valores(filtered, [12, 19, 19, 12])
filtered = window3valores(filtered, [3, 12, 15, 15])
filtered = window3valores(filtered, [3, 12, 12, 15])
filtered = window3valores(filtered, [4, 12, 15, 15])
filtered = window3valores(filtered, [4, 12, 12, 15])


//converte desmatamento de floresta para agro ao invés de campo
filtered = window3valores(filtered, [11, 12, 11, 11])  //evita que campo vire umida por 1 ano
filtered = window3valores(filtered, [11, 4, 11, 11])  //evita que savana vire umida por 1 ano
filtered = window3valores(filtered, [11, 3, 11, 11])  //evita que floresta vire umida por 1 ano


filtered = window3valores(filtered, [3, 11, 3, 3])  //evita que umida vire floresta por 1 ano
filtered = window3valores(filtered, [4, 11, 4, 4])  //evita que umida vire floresta por 1 ano
filtered = window3valores(filtered, [12, 11, 12, 12])  //evita que umida vire floresta por 1 ano

//regras gerais
//var ordem_exec = [ 4, 12,  3, 21,  33]; 
var ordem_exec = [4, 11, 12, 3, 15, 19, 33]; 
//var ordem_exec = [12,  4,  3, 21,  33]; 


for (var i_class=0;i_class<ordem_exec.length; i_class++){  
   var id_class = ordem_exec[i_class]; 
   filtered = window5years(filtered, id_class)
   filtered = window4years(filtered, id_class)
   filtered = window3years(filtered, id_class)
}


var vis = {
    'bands': 'classificationWet_2016',
    'min': 0,
    'max': 34,
    'palette': palettes.get('classification2')
};

filtered = filtered.set ("version", version_out).set ("step", "temporal");
print(filtered)
Map.addLayer(original, vis, 'original');

Map.addLayer(filtered, vis, 'filtered');
Export.image.toAsset({
    'image': filtered,
    'description': file_out + version_out,
    'assetId': dirout + file_out + version_out,
    'pyramidingPolicy': {
        '.default': 'mode'
    },
    'region': filtered.geometry(),
    'scale': 30,
    'maxPixels': 1e13
});
