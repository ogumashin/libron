// @name   libron Saitama module
// @author MIKAMI Yoshiyuki(http://github.com/yoshuki/)

var libron = libron ? libron : new Object();
libron.saitama = {
  name: "埼玉県",
  // 随時追加予定（横断検索 http://cross.lib.pref.saitama.jp/ の仕様が複雑なため利用を断念し、個別対応）
  groups: ["南埼玉地区", "入間地区", "北足立地区", "県内広域"],
  libraries: {
    "kawagoe-shi":    {"group": "入間地区", "name": "川越市立図書館", "httpMethod": "GET"},
    "kawaguchi-shi":  {"group": "北足立地区", "name": "川口市立図書館", "httpMethod": "GET"},
    "koshigaya-shi":  {"group": "南埼玉地区", "name": "越谷市立図書館", "httpMethod": "POST"},
    "saitama-ken":    {"group": "県内広域", "name": "埼玉県立図書館", "httpMethod": "GET"},
    "tokorozawa-shi": {"group": "入間地区", "name": "所沢市立所沢図書館", "httpMethod": "GET"}
  },
  checkLibrary: function(div, isbn) {
    var url;
    var data;
    var onloadFunction;

    switch (selectedLibrary) {
    case 'kawagoe-shi':
      url = 'https://www.lib.city.kawagoe.saitama.jp/toslist.asp';
      data = 'isbnkey1=' + formatIsbn(isbn);
      onloadFunction = (function(responseText, responseHeaders) {
          if (responseText.indexOf('class="cntTable"', 0) > -1) {
            addLink(div, url + '?' + data);
          } else {
            addNALink(div, url + '?' + data);
          }
        });
      break;
    case 'kawaguchi-shi':
      url = 'http://www.kawaguchi-lib.jp/opw1/OPW/OPWSRCH2.CSP';
      data = '';
      onloadFunction = (function(responseText, responseHeaders) {
          var sid = responseText.match(/<input type="hidden" name="SID" value="(.+)">/);
          var requestUrl = 'http://www.kawaguchi-lib.jp/opw1/OPW/OPWSRCHLIST.CSP?DB=LIB&FLG=SEARCH&PID2=OPWSRCH2&MODE=1&LIB=&opr%281%29=OR&qual%281%29=ALL&text%281%29=&opr%282%29=AND&qual%282%29=MZTI&text%282%29=&opr%283%29=AND&qual%283%29=MZAU&text%283%29=&opr%284%29=AND&qual%284%29=ZPB&text%284%29=&opr%285%29=AND&qual%285%29=PY&text%285%29=&opr%286%29=AND&qual%286%29=MZCN&text%286%29=&opr%287%29=AND&qual%287%29=IB&LOCAL%28%22LIB%22%2C%22SK51%22%2C%22ALL%22%29=on&SID=' + sid[1] + '&text%287%29=' + isbn;
          GM_xmlhttpRequest({
            method: "GET",
            url: requestUrl,
            onload: function(res) {
              try {
                if (res.responseText.indexOf('<table width=95% align=center rules=none cellspacing=0 align=left>', 0) > -1) {
                  addLink(div, requestUrl);
                } else {
                  addNALink(div, requestUrl);
                }
              } catch(e) {
                return;
              }
            }
          });
        });
      break;
    case 'koshigaya-shi':
      url = 'http://lib.city.koshigaya.saitama.jp/cgi-bin/webopac/opac_search.cgi';
      data = 'stype=adv&otype=local&dlang=jpn&uid=%3CVAR%3Euid%3C%2FVAR%3E&title=&ftitle=&auth=&pub=&kenmei=&cont_note=&bunrui=&nc_id=&toshoid=&seikyu_kigo=&siryotype=all&year1=&year2=&lang=all&sort_item=title&sort_seq=asc&disp_max=20&req_max=1000&isbn_issn=' + isbn;
      onloadFunction = (function(responseText, responseHeaders) {
          var sid_kbn = responseText.match(/sid=[0-9]+&amp;kbn=1/);
          if (sid_kbn) {
            addLink(div, 'http://lib.city.koshigaya.saitama.jp/cgi-bin/webopac/opac_bdetail.cgi?mode=search&amp;dlang=jpn&amp;stype=adv&amp;otype=local&amp;uid=&amp;' + sid_kbn[0]);
          } else {
            addNALink(div, 'javascript:void(0)', '_self');
          }
        });
      break;
    case 'saitama-ken':
      url = 'https://www.lib.pref.saitama.jp/licsxp-opac/WOpacTifSchCmpdDispAction.do';
      data = '';
      onloadFunction = (function(responseText, responseHeaders) {
          var postData = 'condition3=6&condition3Text=' + isbn;
          GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.lib.pref.saitama.jp/licsxp-opac/WOpacTifSchCmpdExecAction.do",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function(res) {
              try {
                if (res.responseText.indexOf('id="SearchListDocListTitleCaption"', 0) > -1) {
                  addLink(div, "javascript:(function(){var f=document.createElement('form');document.body.appendChild(f);f.method='POST';f.action='https://www.lib.pref.saitama.jp/licsxp-opac/WOpacTifSchCmpdExecAction.do';var c3=document.createElement('input');f.appendChild(c3);c3.name='condition3';c3.value='6';var c3t=document.createElement('input');f.appendChild(c3t);c3t.name='condition3Text';c3t.value='"+isbn+"';f.submit()})()");
                } else {
                  addNALink(div, 'javascript:void(0)', '_self');
                }
              } catch(e) {
                return;
              }
            },
            data: postData
          });
        });
      break;
    case 'tokorozawa-shi':
      url = 'http://lib.city.tokorozawa.saitama.jp/opw/OPW/OPWSRCH2.CSP';
      data = '';
      onloadFunction = (function(responseText, responseHeaders) {
          var sid = responseText.match(/<input type="hidden" name="SID" value="(.+)">/);
          var postData = 'DB=LIB&FLG=SEARCH&PID2=OPWSRCH2&MODE=1&LIB=&opr%281%29=OR&qual%281%29=MZTI&text%281%29=&opr%282%29=AND&qual%282%29=MZAU&text%282%29=&opr%283%29=AND&qual%283%29=MZPB&text%283%29=&opr%284%29=AND&qual%284%29=MZCN&text%284%29=&opr%285%29=AND&qual%285%29=ZGN&text%285%29=&opr%286%29=AND&qual%286%29=PY&text%286%29=&opr%287%29=AND&qual%287%29=MIB&LOCAL%28%22LIB%22%2C%22SK51%22%2C%22ALL%22%29=on&MBID=&SID=' + sid[1] + '&text%287%29=' + isbn;
          GM_xmlhttpRequest({
            method: "POST",
            url: "http://lib.city.tokorozawa.saitama.jp/opw/OPW/OPWSRCHLIST.CSP",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function(res) {
              try {
                if (res.responseText.indexOf('<table width=95% align=center rules=none cellspacing=0 align=left>', 0) > -1) {
                  var link = res.responseText.match(/'(http:\/\/lib\.city\.tokorozawa\.saitama\.jp\/opw\/OPW\/OPWSRCHTYPE\.CSP.+?)'/);
                  addLink(div, link[1]);
                } else {
                  addNALink(div, 'javascript:void(0)', '_self');
                }
              } catch(e) {
                return;
              }
            },
            data: postData
          });
        });
      break;
    }

    if (url && onloadFunction) {
      libron.saitama._checkLibrary(div, isbn, url, data, onloadFunction);
    }
  },
  _checkLibrary: function(div, isbn, url, data, onloadFunction) {
    var httpMethod = libron.saitama.libraries[selectedLibrary].httpMethod;
    var requestUrl;
    var postData;

    switch (httpMethod) {
    case 'GET':
      requestUrl = url;
      if (data) requestUrl += '?' + data;
      postData = null;
      break;
    case 'POST':
      requestUrl = url;
      postData = data;
      break;
    }

    if (httpMethod && requestUrl) {
      GM_xmlhttpRequest({
        method: httpMethod,
        url: requestUrl,
        onload: function(res) {
          try {
            onloadFunction(res.responseText, res.responseHeaders);
          } catch(e) {
            return;
          }
        },
        data: postData
      });
    }
  }
};