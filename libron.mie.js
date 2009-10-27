// @name          libron mie module
// @author        mieron(http://github.com/mieron/)

var libron = libron ? libron : new Object();
libron.mie = {
  name: '三重県',
  groups: ['県立','三重大','北勢(桑員)','北勢(三泗鈴亀)','中勢','松阪飯多','南勢志摩','伊賀','東紀州'],
  libraries: {
// 県立
  'mieken': {'group':'県立', 'name':'三重県立図書館', 'code':''},

// 三重大
  'miedai': {'group':'三重大', 'name':'三重大学付属図書館', 'code':''},

// 北勢(桑員)
  'kuwanachuo': {'group':'北勢(桑員)', 'name':'桑名市立中央図書館', 'code':''},
  'tado': {'group':'北勢(桑員)', 'name':'ふるさと多度文学館', 'code':''},
  'nagashima': {'group':'北勢(桑員)', 'name':'長島輪中図書館', 'code':''},
  'hokusei': {'group':'北勢(桑員)', 'name':'いなべ市北勢図書館', 'code':''},
  'inabe': {'group':'北勢(桑員)', 'name':'いなべ市員弁図書館', 'code':''},
  'daian': {'group':'北勢(桑員)', 'name':'いなべ市大安図書館', 'code':''},
  'fujiwara': {'group':'北勢(桑員)', 'name':'いなべ市藤原図書館', 'code':''},
  'touin': {'group':'北勢(桑員)', 'name':'東員町立図書館', 'code':''},

// 北勢(三泗鈴亀)
  'yokkaichi': {'group':'北勢(三泗鈴亀)', 'name':'四日市市立図書館', 'code':''},
  'kusu': {'group':'北勢(三泗鈴亀)', 'name':'四日市市楠公民館図書室', 'code':''},
  'asake': {'group':'北勢(三泗鈴亀)', 'name':'あさけプラザ図書館', 'code':''},
  'komono': {'group':'北勢(三泗鈴亀)', 'name':'菰野町図書館', 'code':''},
  'asahi': {'group':'北勢(三泗鈴亀)', 'name':'あさひライブラリー', 'code':''},
  'kawagoe': {'group':'北勢(三泗鈴亀)', 'name':'川越町あいあいセンター図書室', 'code':''},
  'suzuka': {'group':'北勢(三泗鈴亀)', 'name':'鈴鹿市立図書館', 'code':''},
  'kameyama': {'group':'北勢(三泗鈴亀)', 'name':'亀山市立図書館', 'code':''},
  },  
  checkLibrary: function(div, isbn){
    if(libron[selectedPrefecture].libraries[selectedLibrary].name == "三重県図書館") {
      date = new Date();
      postdata = "code_genre1=2&code_value1="+isbn+"&library_name1=dummy&area_check1=dummy&area1=dummy&possess_division1=dummy&newarv11=dummy&tkd_poss1=dummy&classflg=0";
      baseurl = "https://www9.milai.pref.mie.jp/MEPLIB/servlet/search.result";
      libron.mie._checkLibraryMieken(div, baseurl, postdata);
    } else {
      postdata = "code_genre1=2&code_value1=" + isbn + "&data_division1=dummy&area_check1=dummy&possess_division1=dummy&title_kind1=dummy&medium_kind1=dummy&newarvl1=dummy&tkd_poss1=dummy&classflg=0";
      baseurl = "https://idx.milai.pref.mie.jp/MEPUTL/servlet/search.result";
      libron.mie._checkLibrary(div, baseurl, postdata);
    }
  },
  _checkLibraryMieken: function(div, baseurl, postdata) {
    GM_xmlhttpRequest({
      method:"POST",
      headers: {'Content-type': 'application/x-www-form-urlencoded;'},
      url: baseurl,
      data: postdata,
      onload:function(response){
        var i = response.responseText.indexOf("./search.detail_list?");
        if(i != -1) {
//          addLink(div, baseurl + "?" + postdata);

          var regex = /HREF=\"\.\/(search.detail_list\?.*?)\"/im;
          var match = regex.exec(response.responseText);

          addLink(div, "https://www9.milai.pref.mie.jp/MEPLIB/servlet/" + match[1]);
        } else {
          addNALink(div, "http://www.milai.pref.mie.jp/mie-lib/");
        }
      },
      onerror:function(response){
        addERLink(div,"http://www.milai.pref.mie.jp/mie-lib/");
      }
    });
  },
  _checkLibrary: function(div, baseurl, postdata) {
    GM_xmlhttpRequest({
      method:"POST",
      headers: {'Content-type': 'application/x-www-form-urlencoded'},
      url: baseurl,
      data: postdata,
      onload:function(response){
        var regex = /HREF=\"\.\/(search.detail_list\?.*?)\"/im;
        var match = regex.exec(response.responseText);

        if(match && match[1]) {
          addLink(div, "https://idx.milai.pref.mie.jp/MEPUTL/servlet/" + match[1]);
        } else {
//          addNALink(div, "http://www.library.pref.mie.jp/oudan.htm");
          addNALink(div, baseurl + "?" + postdata);
        }
      },
      onerror:function(response){
        addERLink(div,responce.responseText);
      }
    });
  }
};