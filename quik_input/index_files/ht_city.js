/*
* City list for Js 
* Copyright (c) 2009 www.htinns.com  
* Author: 黄勇(threem0126)
* $Date: 2009-03-08  $ 
*/
function ht_getcookie(name) {

    var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(";", cookie_start);
    return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));

}

function ht_setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
    var expires = new Date();
    expires.setTime(expires.getTime() + seconds * 1000);
    document.cookie = escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '/')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}

//转移到CityListForJs.ashx 
if (!cities) {
    var cities = '@Beijing|北京|1101@Shanghai|上海|3101@Hangzhou|杭州|3301@Suzhou|苏州|3205@Nanjing|南京|3201@Wuxi|无锡|3202@Huhehaote|呼和浩特|1501@Yixing|宜兴|320282@Jiaxing|嘉兴|330483@Zhangjiagang|张家港|320582@yancheng|盐城|3209@Zhengjiang|镇江|3211@Tianjin|天津|1201@Chengdu|成都|5101@Chongqing|重庆|5001@Changshu|常熟|320581@Xining|西宁|6301@Xian|西安|6101@Wuhan|武汉|4201@Zibo|淄博|3703@Hefei|合肥|3401@Jinan|济南|3701@Fuzhou|福州|3501@Taian|泰安|3709@Huaian|淮安|3208@Dalian|大连|2102@Nanning|南宁|4501@Guilin|桂林|4503@Shenyang|沈阳|2101@Taiyuan|太原|1401@Wuhu|芜湖|3402@Yiwu|义乌|330782@Zhengzhou|郑州|4101@Changchun|长春|2201@Changsha|长沙|4301@Guangzhou|广州|4401@kunshan|昆山|320583@Ningbo|宁波|3302@Xiamen|厦门|3502@Nantong|南通|3206@Taizhou|泰州|3212@Changzhou|常州|3204@Haerbin|哈尔滨|2301@Qingdao|青岛|3702@Shenzhen|深圳|4403@Yangzhou|扬州|3210@Shijiazhuang|石家庄|1301@Putian|莆田|3503@';
}

var array_cities = []; //完整城市列表
var array_cities_filter = []; //当前搜索结果
var array_cities_showing = []; //显示中的城市
var sugSelectItem = 0; //选中项目
var sugSelectTurn = 0; //显示中选中项的序号
var citySelected = 0; //选中城市[SHIJIAZHUANG, 石家庄, 1301] 
var cityfield_focused = false; //输入框是否获得焦点
var mousedownOnPanel = false; //鼠标按在菜单上
var curPageIndex = 0; //当前分页序号


function initCityList(acities) {
    window.array_cities = []; //完整城市列表
    window.array_cities_filter = []; //当前搜索结果
    window.array_cities_showing = []; //显示中的城市
    window.sugSelectItem = 0; //选中项目
    window.sugSelectTurn = 0; //显示中选中项的序号
    window.citySelected = 0; //选中城市[SHIJIAZHUANG, 石家庄, 1301] 
    window.cityfield_focused = false; //输入框是否获得焦点
    window.mousedownOnPanel = false; //鼠标按在菜单上
    window.curPageIndex = 0; //当前分页序号
    //分拆城市信息
    var cities = acities.split('@');
    window.favcityID = ht_getcookie("hj_favcity");
    for (var i = 0; i < cities.length; i++) {
        var titem = cities[i];
        if (titem.length > 0) {
            titem = titem.split('|');
            if (favcityID != "" && titem[2] == favcityID) {
                favcity = titem;
                array_cities.unshift(titem);
                //当fav城市位于第一页时，避免重复显示
                if (i > 8) {
                    array_cities.push(titem);
                }
            } else { array_cities.push(titem); }
        }
    }
    for (var i = 0; i < array_cities.length; i++) { array_cities[i].push(i); }
}

initCityList(cities);

//显示给定的城市列表片段
function city_Bind(acitylist) {
    if (acitylist.length == 0)
        return;
    var tHtml = "";
    $.each(
		acitylist,
		function (aIndex) {
		    if (favcityID == acitylist[aIndex][2])
		        tHtml += "<div class='cityline'  id='citem_" + aIndex + "' cturn='" + acitylist[aIndex][3] + "'><span class='lalign'><b>" + acitylist[aIndex][1] + "</b></span><span class='ralign'><b>" + acitylist[aIndex][0] + "</b></span></div>\n";
		    else
		        tHtml += "<div class='cityline'  id='citem_" + aIndex + "' cturn='" + acitylist[aIndex][3] + "'><span class='lalign'>" + acitylist[aIndex][1] + "</span><span class='ralign'>" + acitylist[aIndex][0] + "</span></div>\n";
		}
	);
    $('#panel_cities').html(tHtml);
    $('.cityline').mouseover(
		function () { city_shiftSelect(this); }
	).click(
		function () { city_confirmSelect(); }
	);
    city_shiftSelect($("#citem_0"));
}
//移动当前选中项
function city_changeSelectIndex(aStep) {
    var asugSelectTurn = sugSelectTurn + aStep;
    if (asugSelectTurn == -1) {
        city_showlist(curPageIndex - 1);
        city_shiftSelect($("#citem_" + (array_cities_showing.length - 1)));
    } else if (asugSelectTurn == array_cities_showing.length) {
        city_showlist(curPageIndex + 1);
        city_shiftSelect($("#citem_0"));
    } else {
        city_shiftSelect($("#citem_" + asugSelectTurn));
    }
}
//确认选择
function city_confirmSelect() {
    $("#cityname").val(citySelected[1]);
    $("#hdcitycode").val(citySelected[2]);

    //$("#arealist_SQ") = 
    ht_setcookie("hj_favcity", citySelected[2], 99999);
    ht_setcookie("hj_favcityname", citySelected[1], 99999);
    $("#form_cities").css("display", "none");

    //执行分支拦截
    if (typeof (city_confirmSelect_TickResv) != "undefined") {
        city_confirmSelect_TickResv(citySelected[2]);
        return;
    }

    //if (HT$("expore_guide"))
    //    HT$("expore_guide").style.display = (citySelected[2] == "3101") ? "block" : "none";
    //  不提供日历面板自动跳转
    //	if( $("#datepickerin").val().length==0 )
    //	{
    //	    $("#datepickerin").focus();
    //	}
    $("#txtSQXZ").val("");
    $("#hdSQXZ").val("");
    $("#txtSQXZ").blur();

    //传入品牌
    var brand = "";
    if (typeof ($("#hdBrandType").val()) != "undefined") {
        brand = $("#hdBrandType").val();
    }

    //更新商圈和行政区
    RefreshSQXZ(citySelected[2], true, brand);

    //绑定酒店列表
    AjaxHotelList(citySelected[2]);
}

function AjaxHotelList(acityCode) {
    try {
        GetAjaxHotelList(acityCode, "");
    }
    catch (Error)
    { }
}

//指定新的选中项，恢复旧项
function city_shiftSelect(atarget) {
    if (sugSelectItem != atarget) {
        if (sugSelectItem != 0)
            $(sugSelectItem).removeClass('citylineover').addClass('cityline').css("backgroundColor", "white");
        if (atarget != 0) {
            try {
                sugSelectItem = atarget;
                var city_j = $(sugSelectItem).removeClass('cityline').addClass('citylineover').css("backgroundColor", "#c8e3fc");
                sugSelectTurn = Number(city_j.attr('id').split("_")[1]);
                citySelected = array_cities[Number(city_j.attr('cturn'))];
                $("#cityid").val(citySelected[2]);
            } catch (e) { }
        }
    }
}
//搜索符合关键字的城市
function filterCity(aKeyword) {
    if (aKeyword.length == 0) {
        $("#top_cities").html("输入中文/拼音或↑↓选择.");
        return array_cities;
    }
    var aList = [];
    var isPinyin = /[^A-z]/.test(aKeyword);
    for (var i = 0; i < array_cities.length; i++) {
        if (isMatchCity(array_cities[i], aKeyword, isPinyin))
            aList.push(array_cities[i]);
    }
    if (aList.length > 0) {
        $("#top_cities").html("按“<font color=red>" + aKeyword + "</font>”字符检索：");
        return aList;
    } else {
        $("#top_cities").html("对不起，找不到：<font color=red>" + aKeyword + "</font>");
        return [];
    }
}
function replaceChar(astring, aindex, Char) {
    return astring.substr(0, aindex) + Char + astring.substr(aindex + 1, astring.length - 1);
}
//判断某城市是否符合搜索条件,只要拼音或中文顺序包含排列关键词字符元素即可
function isMatchCity(aCityInfo, aKey, aisPinyin) {
    var aKey = aKey.toLowerCase();
    var aInfo = [aCityInfo[0].toLowerCase(), aCityInfo[1]];
    //aCityInfo [shanghai, 上海, 1202]
    //是否含有汉字
    var lastIndex = -1;
    if (aisPinyin) {
        aKey = aKey.split("");
        for (var m = 0; m < aKey.length; m++) {
            var newIndex = aInfo[1].indexOf(aKey[m]);
            if (newIndex > lastIndex) {
                aInfo[1] = replaceChar(aInfo[1], newIndex, "-");
                lastIndex = newIndex;
            } else {
                return false;
            }
        }
    } else {
        aKey = aKey.split("");
        for (var m = 0; m < aKey.length; m++) {
            var newIndex = aInfo[0].indexOf(aKey[m]);
            if (newIndex > lastIndex) {
                aInfo[0] = replaceChar(aInfo[0], newIndex, "-");
                lastIndex = newIndex;
            } else {
                return false;
            }
        }
    }
    return true;
}
//显示当前城市列表中的指定分页
function city_showlist(aPageNo) {
    if (array_cities_filter.length > 8) {
        //取分页数据
        var pagecount = Math.ceil((array_cities_filter.length + 1) / 8);
        if (aPageNo == -1)
            aPageNo = (pagecount - 1)
        else if (aPageNo == pagecount)
            aPageNo = 0;
        array_cities_showing = array_cities_filter.slice(8 * (aPageNo), Math.min(8 * (aPageNo + 1), array_cities_filter.length));
        city_Bind(array_cities_showing);
        //翻页控制
        var flipHtml = (aPageNo == 0) ? "&laquo;上一页" : "<a href='' class='cityflip' onclick='city_showlist(" + (aPageNo - 1) + ");return false;'>&laquo;上一页</a>";
        flipHtml += "&nbsp;&nbsp;&nbsp;&nbsp;" + (aPageNo + 1) + "/" + pagecount + "&nbsp;&nbsp;&nbsp;&nbsp;";
        flipHtml += (aPageNo == pagecount - 1) ? "下一页&raquo;" : "<a href='' class='cityflip' onclick='city_showlist(" + (aPageNo + 1) + ");return false;'>下一页&raquo;</a>";
        $("#flip_cities").html(flipHtml);
        $("#flip_cities").css("display", "block");
    } else {
        aPageNo = 0;
        array_cities_showing = array_cities_filter;
        city_Bind(array_cities_showing);
        $("#flip_cities").css("display", "none");
    }
    curPageIndex = aPageNo;
    if ($("#form_cities").css("display") == "block") $("#cityname").focus();

}

function reloadCityPage() {
    array_cities_filter = filterCity("");
    city_showlist(0);
}

//页面初始化
$(document).ready(
	function () {
	    //空条件过滤出所有城市列表
	    reloadCityPage();
	    $("#cityname").keydown(
			function (aevent) {
			    aevent = aevent || window.event;
			    if (aevent.keyCode == 40) {
			        city_changeSelectIndex(1);
			        $("#form_cities").css("display", "block");
			    } else if (aevent.keyCode == 38) {
			        city_changeSelectIndex(-1);
			        $("#form_cities").css("display", "block");
			    } else if (aevent.keyCode == 13) { city_confirmSelect(); }

			}
		).focus(
			function () {
			    cityfield_focused = true;
			    hidehotellist();
			    //!!!
			    HiddenDateBox();
			    city_shiftSelect($("#citem_0"));
			    $("#form_cities").css("display", "block");
			    GetPyzyIframe("ifmdivPyzyDateBox", "hidden");
			    return true;
			}
		).blur(
			function () {
			    if (!mousedownOnPanel) {
			        cityfield_focused = false;
			        $("#form_cities").css("display", "none");
			    }
			    return true;
			}
		).keyup(
			function (aevent) {
			    aevent = aevent || window.event;
			    if (aevent.keyCode != 40 && aevent.keyCode != 38 && aevent.keyCode != 37 && aevent.keyCode != 39 && aevent.keyCode != 13 && aevent.keyCode != 9) {
			        array_cities_filter = filterCity($("#cityname").val());
			        city_showlist(0);
			    }
			}
		)
	    $('#form_cities').mousedown(
			function () { mousedownOnPanel = true; }
		).mouseup(
			function () { mousedownOnPanel = false; }
		)
	    $('#txtSQXZ').focus(
			function () { ShowdivSQXZ(); }
		)



	    var favcityCityName = MapCityName(favcityID);
	    if ($("#cityname").val() != undefined)
	        if (favcityCityName.length > 0 && $("#cityname").val().length == 0) {
	            $("#cityname").val(favcityCityName);
	        }
	}
)

function hidehotellist() {
    try {
        $("#selHotel").css("display", "none");
    }
    catch (err)
    { }
}


function MapCityID(aCityname) {
    //[Beijing, 北京, 1100]
    for (var i = 0; i < array_cities.length; i++) {
        if (array_cities[i][1] == aCityname) {
            return array_cities[i][2];
        }
    }
    return 0;
}

function MapCityName(aCidyID) {
    //[Beijing, 北京, 1100]
    for (var i = 0; i < array_cities.length; i++) {
        if (array_cities[i][2] == aCidyID) {
            return array_cities[i][1];
        }
    }
    return "";
}

////获取当天日期：格式"yyyy-mm-dd"
//function getdate()
//{   
//  var now=new Date();
//  y=now.getFullYear();
//  m=now.getMonth()+1;
//  d=now.getDate();
//  m=m<10?"0"+m:m;
//  d=d<10?"0"+d:d;
//  return y+"-"+m+"-"+d;
//}

////获取后一天日期：格式"yyyy-mm-dd"
//function getnextdate(date)
//{ 
//  y=date.getFullYear();
//  m=date.getMonth()+1;
//  d=date.getDate()+1;
//  m=m<10?"0"+m:m;
//  d=d<10?"0"+d:d;
//  return y+"-"+m+"-"+d;
//}

//酒店位置代码：
function hiddenSQDiv() {
    document.getElementById("divSQXZ").style.display = "none"
}

function ShowdivSQXZ() {
    $('#divSQXZ').css('display', 'block');
    if (HT$("divPyzyDateBox") != undefined) {
        HT$("divPyzyDateBox").style.display = "none";
        GetPyzyIframe("ifmdivPyzyDateBox", "hidden");
    }
    return true;
}

function SearchBySQ(alinkObj, aSQname, aSQcode) {
    document.getElementById("divSQXZ").style.display = "none";

    if (aSQname.length > 0) {
        $('#txtSQXZ').val(aSQname);
        $('#hdSQXZ').val(aSQcode);
    }
    try {
        GetAjaxHotelList("", aSQcode);
    }
    catch (Error) { }
    return false;
}

function SearchByXZ(alinkObj, aXZname, aXZcode) {
    document.getElementById("divSQXZ").style.display = "none";
    if (aXZname.length > 0) {
        $('#txtSQXZ').val(aXZname);
        $('#hdSQXZ').val(aXZcode);
    }
    try {
        GetAjaxHotelList("", aXZcode);
    }
    catch (Error) { }
    return false;
}

function RefreshSQXZ(cityCode, NotSkip) {
    if (HT$("txtSQXZ") != null) {

        RefreshArea(cityCode, "SQ", "");
        RefreshArea(cityCode, "XZ", "");

        if (!NotSkip)
            document.getElementById("datepickerin").focus();
    }
}

function RefreshSQXZ(cityCode, NotSkip, brand) {
    if (HT$("txtSQXZ") != null) {

        RefreshArea(cityCode, "SQ", brand);
        RefreshArea(cityCode, "XZ", brand);

        if (!NotSkip)
            document.getElementById("datepickerin").focus();
    }
}
///填充商圈和行政区
function RefreshArea(cityCode, flag, brand) {
    ///标志是否商圈和行政区
    var isFlag = (flag == "SQ");
    $.ajax({
        url: "/CityListHandler.ashx",
        type: "POST",
        cache: true,
        dataType: "json",
        data: { cityCode: cityCode, flag: flag, brand: brand },
        success: function (areaList) {
            var innerhtml = "";
            var addMethod = isFlag ? "SearchBySQ" : "SearchByXZ";
            if (null != areaList) {
                $.each(areaList, function (i, item) {
                    var areaCode = item.areaCode;
                    var areaName = item.areaName;
                    hotelcount = item.hotelcount;
                    var list = [];
                    list.push("<a class='arearmenulink' ");
                    list.push(" onmousedown='" + addMethod + "(this,\"" + areaName + "\", \"" + areaCode + "\")'");
                    list.push(" onclick='" + addMethod + "(this,\"" + areaName + "\", \"" + areaCode + "\")'");
                    list.push(" title='" + areaName + "' value='CH'>" + areaName + "(" + hotelcount + ")" + "</a>");
                    innerhtml += list.join();
                });
            } else {
                innerhtml = isFlag ? "&nbsp;&nbsp;尚无商圈区域信息"
                                   : "&nbsp;&nbsp;尚无行政区信息";
            }
            if (isFlag) {
                HT$("divSQ").innerHTML = innerhtml;
            } else {
                HT$("divXZ").innerHTML = innerhtml;
            }
        }
    });
}
function GetSearch(alinkObj) {
    if ($('#cityname').val() == "" || $('#cityname').val() == "<中文或拼音>") {
        alert("请选择酒店所在城市！")
        return false;
    }

    var curInput = $("#cityname").val();
    var acityID = MapCityID(curInput);
    if (acityID != $('#hdcitycode').val()) {
        if (acityID != 0) {
            $('#hdcitycode').val(acityID);
        } else {
            alert("‘" + curInput + "’尚无开业汉庭酒店，请选择其他城市！");
            return false;
        }
    }

    var startedate = $('#datepickerin').val();
    var enddate = $('#datepickerout').val();
    var checkdateresult = CheckDate('datepickerin', 'datepickerout');
    if (checkdateresult != "") {
        alert(checkdateresult);
        return false;
    }
    var areaName = $('#txtSQXZ').val();
    var areaCode = $('#hdSQXZ').val();
    if (areaName == "" || areaName == "<选城市区域>")
        areaCode = "";
    var hotelname = $('#htname').val();
    var cityid = $('#hdcitycode').val();
    if (hotelname == null || hotelname.indexOf("关键字") != -1)
        hotelname = "";
    var hotelstyle = $('#hotel_quicksearch1_hotelBrand').val();
    if (hotelstyle == null || hotelstyle == "" || hotelstyle == "undefined")
        hotelstyle = "";

    var onlyWeek = $('#cbox_onlyWeek');
    if (onlyWeek == null || onlyWeek == "" || onlyWeek == "undefined") {
        onlyWeek = "0";
    }
    else if (onlyWeek.attr("checked")) {
        onlyWeek = "1";
    }
    else {
        onlyWeek = "0";
    }
    var url = "/hotelinfo/hotel_select.aspx?startdate=" + escape(startedate) + "&enddate=" + escape(enddate) + "&cityID=" + escape(cityid) + "&areaID=" + escape(areaCode) + "&hotelname=" + escape(hotelname) + "&hotelstyle=" + escape(hotelstyle) + "&onlyWeek=" + escape(onlyWeek);
   
    expo_check(escape(cityid), escape(startedate), escape(enddate));
    if (alinkObj) {
        alinkObj.href = url;
        return true;
    } else {
        window.location.href = url;
        return false;
    }
}

// - ==== 业务方法 ====
$(function () {
    if (HT$("txtSQXZ") != null) {
        //隐藏商圈列表
        $("#txtSQXZ").blur(function () {
            setTimeout("hiddenSQDiv();", 100);
            return true;
        });
        if (favcityID == 0 && HT$("cityname").value == "<中文或拼音>") {
            HT$("divXZ").innerHTML = "请先选择城市！";
            HT$("divSQ").innerHTML = "请先选择城市！";
        } else {
            if (HT$("hdcitycode").value == "")
                HT$("hdcitycode").value = favcityID;
            HT$("cityname").value = MapCityName(HT$("hdcitycode").value);

            //传入品牌
            var brand = "";
            if (typeof ($("#hdBrandType").val()) != "undefined") {
                brand = $("#hdBrandType").val();
            }
            RefreshSQXZ(HT$("hdcitycode").value, true, brand);
        }
    }
});

function ShowDailyRate(ojb, id) {
    $("#" + id).css("display", "block");
}

function HideDailyRate(ojb, id) {
    $("#" + id).css("display", "none");
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++   日历控件    +++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//取得某对象，若提供ID下的对象不存在则自动创建
function c$(fctId, fctClassName) {
    var varTempDivObj = HT$(fctId);
    if (!varTempDivObj) {
        GetPyzyIframe("ifm" + fctId);
        varTempDivObj = document.createElement("div");
        varTempDivObj.id = fctId;
        if (fctClassName && fctClassName != "") varTempDivObj.className = fctClassName;
        document.body.appendChild(varTempDivObj);
    }
    return varTempDivObj;
}

//取得某ID的iframe对象，若不存在该ID的对象则自动创建
function GetPyzyIframe(fctIfmId, fctVisibility, fctTop, fctLeft, fctWidth, fctHeight) {
    var varTempIfmObj = HT$(fctIfmId);
    if (!varTempIfmObj) {
        varTempIfmObj = document.createElement("iframe");
        varTempIfmObj.id = fctIfmId;
        varTempIfmObj.style.position = "absolute";
        varTempIfmObj.style.zIndex = "1";
        varTempIfmObj.style.visibility = "hidden";
        document.body.appendChild(varTempIfmObj);
    }
    if (fctTop) varTempIfmObj.style.top = fctTop + "px";
    if (fctLeft) varTempIfmObj.style.left = fctLeft + "px";
    if (fctWidth) varTempIfmObj.style.width = fctWidth + "px";
    if (fctHeight) varTempIfmObj.style.height = fctHeight + "px";
    if (fctVisibility) varTempIfmObj.style.visibility = (document.all ? fctVisibility : "hidden	");
    return varTempIfmObj;
}

//取得某对象的坐标位置、宽、高
function getPosition(obj) {
    var top = 0;
    var left = 0;
    var width = obj.offsetWidth;
    var height = obj.offsetHeight;
    while (obj.offsetParent) {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return { "top": top, "left": left, "width": width, "height": height };
}

//取得编码存储框对象
function GetValueToInputObj(fctThisObj) {
    if (!fctThisObj) return null;
    var varThisObjAutoInput = (fctThisObj.getAttributeNode("value_to_input") ? fctThisObj.getAttributeNode("value_to_input").value : "");
    if (varThisObjAutoInput == "") return null;
    return HT$(varThisObjAutoInput);
}

//自动触发下一个对象的Act事件
function AutoNextInputAct(fctThisObj, fctAct) {
    var varNextInput = fctThisObj.getAttributeNode("nextinput");
    if (varNextInput && varNextInput != "") {
        if (document.all) {
            eval("HT$('" + varNextInput.value + "')." + fctAct + "()");
        } else {
            var evt = document.createEvent("MouseEvents");
            evt.initEvent(fctAct, true, true);
            HT$(varNextInput.value).dispatchEvent(evt);
        }
        HT$(varNextInput.value).focus();
    }
}

//给某对象的某事件增加处理函数AddFunToObj(document,"onclick","alert('1');")
function AddFunToObj(fctObj, fctAct, fctFunction) {
    if (fctObj.addEventListener) { //!IE
        fctObj.addEventListener(fctAct.replace("on", ""), function (e) {
            e.cancelBubble = !eval(fctFunction);
        }, false);
    } else if (fctObj.attachEvent) { //IE
        fctObj.attachEvent(fctAct, function () {
            return eval(fctFunction);
        });
    }
}


/**********日历选择功能*************/
document.write('\
	<style type="text/css">\
		.DateListBox{float:left;border:solid #5A9AD9 1px;width:147px !important;width:142px;_width:154px;height:168px !important;height:186px;font-size:12px;text-align:center;}\
		.DateListBox h1{width:100%;background-color:#F4FAFF;color:#0055aa;font-size:12px;height:20px;font-weight:bold;line-height:20px;vertical-align:middle;margin:0px;}\
		.DateListBox div{float:left;border:solid #002E7C 0px;background-color:#006CFF;color:#fff;width:21px !important;width:22px;height:20px;font-size:12px;font-weight:bold;line-height:20px;vertical-align:middle;}\
		.DateListBox a{float:left;color:#0055aa;border:solid #ffffff 1px;background-color:#ffffff;width:19px !important;width:20px;height:19px !important;height:22px;font-size:12px;line-height:20px;vertical-align:middle;}\
		.DateListBox a:hover{border:solid #fff 1px;background-color:#79b1e5; color:#fff;}\
		.DateListBox .aSelect{cursor:pointer;border:solid #fff 1px;background-color:#d1e8fe;color:#006cff;font-weight:bold;}\
		.PyzyDateBox{position:absolute;z-index:1;visibility:hidden;background-color:#FFFFFF;border:solid #e0e0e0 0px;height:170px;width:297px !important;width:285px;}\
	</style>\
');

//取得日历列表，该函数输出的内容需要根据需求放置到特定的容器中，如浮动层、固定DIV…
function GetMonthHTML(fctStaDate, fctDate, index, fctJNum, fDate) {
    if (!fctDate) fctDate = new Date(); //默认为当前日期
    var varYear = fctDate.getFullYear();
    var varMonth = fctDate.getMonth();
    var varNextMonth = new Date(varYear, varMonth + 1, 1);
    var varThisMonthButDay = new Date(varNextMonth - 86400000); //本月最后一天

    var varThisDate, varThisWeekDay, varThisMonthHTML = "";
    if ((index % 2) == 0) {
        varThisMonthHTML += '<h1><span style="cursor:pointer;" onclick="ShowTwoMonthList(null,' + (fctJNum - 1) + (fDate ? ',\'' + fDate + '\'' : '') + ')"   title="上月">&lt;&lt;</span>&nbsp;&nbsp;' + varYear + '年' + (varMonth + 1) + '月</h1>';
    }
    else {
        varThisMonthHTML += '<h1>' + varYear + '年' + (varMonth + 1) + '月&nbsp;&nbsp;<span style="cursor:pointer;" onclick="ShowTwoMonthList(null,' + (fctJNum + 1) + (fDate ? ',\'' + fDate + '\'' : '') + ')"   title="下月">&gt;&gt;</span></h1>';
    }
    varThisMonthHTML += "<div style='color:yellow;' >日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div style='color:yellow;'>六</div>"
    for (var DayI = 1; DayI <= varThisMonthButDay.getDate(); DayI++) {
        varThisDate = new Date(varYear, varMonth, DayI);
        varThisWeekDay = varThisDate.getDay();
        if (DayI == 1) {
            for (var spcI = 0; spcI < varThisWeekDay; spcI++) {
                varThisMonthHTML += "<a></a>"
            }
        }
        varThisMonthHTML += "<a " + ((fctStaDate && fctStaDate != "") ? (varThisDate <= fctStaDate ? "old" : "") : "") + " href=javascript:; onmousedown='SelectDate(this)' title='" + varYear + "-" + (varMonth + 1) + "-" + DayI + "'>" + DayI + "</a>";
    }
    if (index == 0)
        return '<div class="DateListBox">' + varThisMonthHTML + '</div>';
    else
        return "<div class='DateListBox' style='border-left:none;'>" + varThisMonthHTML + '</div>';
}

//取得日历列表，该函数输出的内容需要根据需求放置到特定的容器中，如浮动层、固定DIV…---英文版
function GetMonthHTMLEn(fctStaDate, fctDate, index, fctJNum, fDate) {
    if (!fctDate) fctDate = new Date(); //默认为当前日期
    var varYear = fctDate.getFullYear();
    var varMonth = fctDate.getMonth();
    var varNextMonth = new Date(varYear, varMonth + 1, 1);
    var varThisMonthButDay = new Date(varNextMonth - 86400000); //本月最后一天

    var varThisDate, varThisWeekDay, varThisMonthHTML = "";
    if ((index % 2) == 0) {
        varThisMonthHTML += '<h1><span style="cursor:pointer;" onclick="ShowTwoMonthListEn(null,' + (fctJNum - 1) + (fDate ? ',\'' + fDate + '\'' : '') + ')"   title="Last Month">&lt;&lt;</span>&nbsp;&nbsp;' + GetMonthEnDescript(varMonth + 1) + '&nbsp;&nbsp;' + varYear + '</h1>';
    }
    else {
        varThisMonthHTML += '<h1>' + GetMonthEnDescript(varMonth + 1) + '&nbsp;&nbsp;' + varYear + '&nbsp;&nbsp;<span style="cursor:pointer;" onclick="ShowTwoMonthListEn(null,' + (fctJNum + 1) + (fDate ? ',\'' + fDate + '\'' : '') + ')"   title="Next Month">&gt;&gt;</span></h1>';
    }
    varThisMonthHTML += "<div style='color:yellow;' >S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div style='color:yellow;'>S</div>"
    for (var DayI = 1; DayI <= varThisMonthButDay.getDate(); DayI++) {
        varThisDate = new Date(varYear, varMonth, DayI);
        varThisWeekDay = varThisDate.getDay();
        if (DayI == 1) {
            for (var spcI = 0; spcI < varThisWeekDay; spcI++) {
                varThisMonthHTML += "<a></a>"
            }
        }
        varThisMonthHTML += "<a " + ((fctStaDate && fctStaDate != "") ? (varThisDate <= fctStaDate ? "old" : "") : "") + " href=javascript:; onmousedown='SelectDate(this)' title='" + varYear + "-" + (varMonth + 1) + "-" + DayI + "'>" + DayI + "</a>";
    }
    if (index == 0)
        return '<div class="DateListBox">' + varThisMonthHTML + '</div>';
    else
        return "<div class='DateListBox' style='border-left:none;'>" + varThisMonthHTML + '</div>';
}

function GetMonthEnDescript(monthcn) {
    switch (monthcn) {
        case 1:
            return "Jan";
        case 2:
            return "Feb";
        case 3:
            return "Mar";
        case 4:
            return "Apr";
        case 5:
            return "May";
        case 6:
            return "Jun";
        case 7:
            return "Jul";
        case 8:
            return "Aug";
        case 9:
            return "Sep";
        case 10:
            return "Oct";
        case 11:
            return "Nov";
        case 12:
            return "Dec";
    }
}

//取得日历列表，该函数输出的内容需要根据需求放置到特定的容器中，如浮动层、固定DIV…
function GetMonthHTMLAll(fctStaDate, fctDate, index, fctJNum, fDate) {
    if (!fctDate) fctDate = new Date(); //默认为当前日期
    var varYear = fctDate.getFullYear();
    var varMonth = fctDate.getMonth();
    var varNextMonth = new Date(varYear, varMonth + 1, 1);
    var varThisMonthButDay = new Date(varNextMonth - 86400000); //本月最后一天

    var varThisDate, varThisWeekDay, varThisMonthHTML = "";
    if ((index % 2) == 0) {
        varThisMonthHTML += '<h1><span style="cursor:pointer;" onclick="ShowTwoMonthListShowAll(null,' + (fctJNum - 1) + (fDate ? ',\'' + fDate + '\'' : '') + ')"   title="上月">&lt;&lt;</span>&nbsp;&nbsp;' + varYear + '年' + (varMonth + 1) + '月</h1>';
    }
    else {
        varThisMonthHTML += '<h1>' + varYear + '年' + (varMonth + 1) + '月&nbsp;&nbsp;<span style="cursor:pointer;" onclick="ShowTwoMonthListShowAll(null,' + (fctJNum + 1) + (fDate ? ',\'' + fDate + '\'' : '') + ')"   title="下月">&gt;&gt;</span></h1>';
    }
    varThisMonthHTML += "<div style='color:yellow;' >日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div style='color:yellow;'>六</div>"
    for (var DayI = 1; DayI <= varThisMonthButDay.getDate(); DayI++) {
        varThisDate = new Date(varYear, varMonth, DayI);
        varThisWeekDay = varThisDate.getDay();
        if (DayI == 1) {
            for (var spcI = 0; spcI < varThisWeekDay; spcI++) {
                varThisMonthHTML += "<a></a>"
            }
        }
        varThisMonthHTML += "<a " + ((fctStaDate && fctStaDate != "") ? (varThisDate <= fctStaDate ? "old" : "") : "") + " href=javascript:; onmousedown='SelectDate(this)' title='" + varYear + "-" + (varMonth + 1) + "-" + DayI + "'>" + DayI + "</a>";
    }
    if (index == 0)
        return '<div class="DateListBox">' + varThisMonthHTML + '</div>';
    else
        return "<div class='DateListBox' style='border-left:none;'>" + varThisMonthHTML + '</div>';
}

//选择日期
function SelectDate(fctAObj) {
    if (fctAObj.href || fctAObj.className == "aSelect") {
        var varValueObj = HT$("divPyzyDateBox").Obj;
        var varValueToObj = GetValueToInputObj(varValueObj);
        if (varValueToObj) varValueObj = varValueToObj;
        //		if(varValueObj.value==fctAObj.title){
        //			varValueObj.value="";
        //		}else{
        varValueObj.value = fctAObj.title;
        //		}
        HT$("divPyzyDateBox").style.visibility = "hidden";
        HT$("divPyzyDateBox").bodyclick = "";
        GetPyzyIframe("ifmdivPyzyDateBox", "hidden");
        AutoNextInputAct(HT$("divPyzyDateBox").Obj, "click");

        if (varValueObj.id == "startdate" || varValueObj.id == "enddate") {
            if (fctAObj.title != varValueObj.defaultValue) {
                if (document.getElementById("message_datechanged") != null)
                    document.getElementById("message_datechanged").style.display = "block";
            }
        }
        if (document.getElementById("tbroom") != null) {
            ShowHotelInfo();
        }
        //		//绑定下一日
        //		$("#datepickerout").val(getnextdate(new Date(Date.parse($("#datepickerin").val().replace("-","/")))));
        //		$("#enddate").val(getnextdate(new Date(Date.parse($("#startdate").val().replace("-","/")))));
        if (varValueObj.id == "datepickerin") {
            if (typeof (changestartdate) == "function") {
                changestartdate();
            }
        }
    }
}


//获取当天日期：格式"yyyy-mm-dd"
function getdate() {
    var now = new Date();
    y = now.getFullYear();
    m = now.getMonth() + 1;
    d = now.getDate();
    m = m < 10 ? "" + m : m;
    d = d < 10 ? "" + d : d;
    return y + "-" + m + "-" + d;
}

//获取后一天日期：格式"yyyy-mm-dd"
function getnextdate(date) {
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate() + 1;
    m = m < 10 ? "" + m : m;
    d = d < 10 ? "" + d : d;
    return y + "-" + m + "-" + d;
}

//隐藏日历
function HiddenDateBox() {
    if (HT$("divPyzyDateBox")) {
        if (HT$("divPyzyDateBox").style.visibility != "hidden" && HT$("divPyzyDateBox").bodyclick == "1") {
            HT$("divPyzyDateBox").style.visibility = "hidden";
            HT$("divPyzyDateBox").bodyclick = "";
            GetPyzyIframe("ifmdivPyzyDateBox", "hidden");
        } else {
            HT$("divPyzyDateBox").bodyclick = "1";
        }
    }
}

//显示日历
function ShowTwoMonthList(fctThisObj, fctJNum, fctStaDate) {
    if (!fctJNum) fctJNum = 0;
    if (!fctThisObj) fctThisObj = "";
    var varStaDate = null, varTheDate = new Date();
    if (fctStaDate || fctStaDate == "") {
        varStaDate = new Date(new Date() - 86400000); //如果没有定义具体可使用的开始时间则自定义为今天
        var varStaDateSplit = fctStaDate.split("-");
        if (varStaDateSplit.length == 3) {
            varStaDate = new Date(varStaDateSplit[0], parseInt(varStaDateSplit[1], 10) - 1, varStaDateSplit[2]); //fctStaDate=new Date();
        }
        varTheDate = varStaDate;
        if (fctStaDate == "") fctStaDate = varStaDate.getFullYear() + "-" + (varStaDate.getMonth() + 1) + "-" + varStaDate.getDate();
    }
    var varShowTwoMonthHTML = "";
    var index = -1;
    for (var i = 0 + fctJNum; i < 2 + fctJNum; i++) {
        index++;
        varShowTwoMonthHTML += GetMonthHTML((varStaDate ? varStaDate : ""), new Date(varTheDate.getFullYear(), varTheDate.getMonth() + i, 1), index, fctJNum, fctStaDate);
    }
    if (varStaDate) varShowTwoMonthHTML = varShowTwoMonthHTML.replace(/old href/g, "style=color:#B8D7FF old");

    if (fctThisObj.value != "") { //对已选日期样式进行改变
        if (/^((\d{4})|(\d{2}))-(\d{1,2})-(\d{1,2})$/g.test(fctThisObj.value)) varShowTwoMonthHTML = varShowTwoMonthHTML.replace(fctThisObj.value, fctThisObj.value + "' class='aSelect");
    }

    var varDateBoxObj = c$("divPyzyDateBox", "PyzyDateBox");
    varDateBoxObj.bodyclick = "";
    if (fctThisObj != "") { //调整坐标到合适位置
        var varThisObjPosition = getPosition(fctThisObj);
        varDateBoxObj.style.top = (varThisObjPosition.top + varThisObjPosition.height) + "px";
        varDateBoxObj.style.left = varThisObjPosition.left + "px";
        varDateBoxObj.style.visibility = "visible"; //hidden
        varDateBoxObj.Obj = fctThisObj;
        GetPyzyIframe("ifmdivPyzyDateBox", "visible", (varThisObjPosition.top + varThisObjPosition.height), varThisObjPosition.left, varDateBoxObj.offsetWidth, varDateBoxObj.offsetHeight); //取Iframe
    }
    HT$("divPyzyDateBox").style.display = "block";
    varDateBoxObj.innerHTML = '<div style="_width:312px;">' + varShowTwoMonthHTML + '</div>';
    //GetPyzyIframe("ifmdivPyzyDateBox","visible",(varThisObjPosition.top+varThisObjPosition.height),varThisObjPosition.left,varDateBoxObj.offsetWidth,varDateBoxObj.offsetHeight); //取Iframe

    //地图预订页面最低价处理
}

//显示英文日历
function ShowTwoMonthListEn(fctThisObj, fctJNum, fctStaDate) {
    if (!fctJNum) fctJNum = 0;
    if (!fctThisObj) fctThisObj = "";
    var varStaDate = null, varTheDate = new Date();
    if (fctStaDate || fctStaDate == "") {
        varStaDate = new Date(new Date() - 86400000); //如果没有定义具体可使用的开始时间则自定义为今天
        var varStaDateSplit = fctStaDate.split("-");
        if (varStaDateSplit.length == 3) {
            varStaDate = new Date(varStaDateSplit[0], parseInt(varStaDateSplit[1], 10) - 1, varStaDateSplit[2]); //fctStaDate=new Date();
        }
        varTheDate = varStaDate;
        if (fctStaDate == "") fctStaDate = varStaDate.getFullYear() + "-" + (varStaDate.getMonth() + 1) + "-" + varStaDate.getDate();
    }
    var varShowTwoMonthHTML = "";
    var index = -1;
    for (var i = 0 + fctJNum; i < 2 + fctJNum; i++) {
        index++;
        varShowTwoMonthHTML += GetMonthHTMLEn((varStaDate ? varStaDate : ""), new Date(varTheDate.getFullYear(), varTheDate.getMonth() + i, 1), index, fctJNum, fctStaDate);
    }
    if (varStaDate) varShowTwoMonthHTML = varShowTwoMonthHTML.replace(/old href/g, "style=color:#B8D7FF old");

    if (fctThisObj.value != "") { //对已选日期样式进行改变
        if (/^((\d{4})|(\d{2}))-(\d{1,2})-(\d{1,2})$/g.test(fctThisObj.value)) varShowTwoMonthHTML = varShowTwoMonthHTML.replace(fctThisObj.value, fctThisObj.value + "' class='aSelect");
    }

    var varDateBoxObj = c$("divPyzyDateBox", "PyzyDateBox");
    varDateBoxObj.bodyclick = "";
    if (fctThisObj != "") { //调整坐标到合适位置
        var varThisObjPosition = getPosition(fctThisObj);
        varDateBoxObj.style.top = (varThisObjPosition.top + varThisObjPosition.height) + "px";
        varDateBoxObj.style.left = varThisObjPosition.left + "px";
        varDateBoxObj.style.visibility = "visible"; //hidden
        varDateBoxObj.Obj = fctThisObj;
        GetPyzyIframe("ifmdivPyzyDateBox", "visible", (varThisObjPosition.top + varThisObjPosition.height), varThisObjPosition.left, varDateBoxObj.offsetWidth, varDateBoxObj.offsetHeight); //取Iframe
    }
    HT$("divPyzyDateBox").style.display = "block";
    varDateBoxObj.innerHTML = '<div style="_width:312px;">' + varShowTwoMonthHTML + '</div>';
    //GetPyzyIframe("ifmdivPyzyDateBox","visible",(varThisObjPosition.top+varThisObjPosition.height),varThisObjPosition.left,varDateBoxObj.offsetWidth,varDateBoxObj.offsetHeight); //取Iframe

    //地图预订页面最低价处理
}

//显示日历
function ShowTwoMonthListShowAll(fctThisObj, fctJNum, fctStaDate) {
    if (!fctJNum) fctJNum = 0;
    if (!fctThisObj) fctThisObj = "";
    var varStaDate = null, varTheDate = new Date();
    if (fctStaDate || fctStaDate == "") {
        varStaDate = new Date(new Date() - 86400000); //如果没有定义具体可使用的开始时间则自定义为今天
        var varStaDateSplit = fctStaDate.split("-");
        if (varStaDateSplit.length == 3) {
            varStaDate = new Date(varStaDateSplit[0], parseInt(varStaDateSplit[1], 10) - 1, varStaDateSplit[2]); //fctStaDate=new Date();
        }
        varTheDate = varStaDate;
        if (fctStaDate == "") fctStaDate = varStaDate.getFullYear() + "-" + (varStaDate.getMonth() + 1) + "-" + varStaDate.getDate();
    }
    var varShowTwoMonthHTML = "";
    var index = -1;
    for (var i = 0 + fctJNum; i < 2 + fctJNum; i++) {
        index++;
        varShowTwoMonthHTML += GetMonthHTMLAll((varStaDate ? varStaDate : ""), new Date(varTheDate.getFullYear(), varTheDate.getMonth() + i, 1), index, fctJNum, fctStaDate);
    }
    //if(varStaDate)varShowTwoMonthHTML=varShowTwoMonthHTML.replace(/old href/g,"style=color:#B8D7FF old");

    if (fctThisObj.value != "") { //对已选日期样式进行改变
        if (/^((\d{4})|(\d{2}))-(\d{1,2})-(\d{1,2})$/g.test(fctThisObj.value)) varShowTwoMonthHTML = varShowTwoMonthHTML.replace(fctThisObj.value, fctThisObj.value + "' class='aSelect");
    }

    var varDateBoxObj = c$("divPyzyDateBox", "PyzyDateBox");
    varDateBoxObj.bodyclick = "";
    if (fctThisObj != "") { //调整坐标到合适位置
        var varThisObjPosition = getPosition(fctThisObj);
        varDateBoxObj.style.top = (varThisObjPosition.top + varThisObjPosition.height) + "px";
        varDateBoxObj.style.left = varThisObjPosition.left + "px";
        varDateBoxObj.style.visibility = "visible"; //hidden
        varDateBoxObj.Obj = fctThisObj;
        GetPyzyIframe("ifmdivPyzyDateBox", "visible", (varThisObjPosition.top + varThisObjPosition.height), varThisObjPosition.left, varDateBoxObj.offsetWidth, varDateBoxObj.offsetHeight); //取Iframe
    }
    HT$("divPyzyDateBox").style.display = "block";
    varDateBoxObj.innerHTML = '<div style="_width:312px;">' + varShowTwoMonthHTML + '</div>';
    //GetPyzyIframe("ifmdivPyzyDateBox","visible",(varThisObjPosition.top+varThisObjPosition.height),varThisObjPosition.left,varDateBoxObj.offsetWidth,varDateBoxObj.offsetHeight); //取Iframe
}

function _Hidden() {
    //
}

//为window.onload增加一个为document增加onclick处理函数的函数
AddFunToObj(window, "onload", "AddFunToObj(document,'onclick','_Hidden(" + (document.all ? "" : "e") + ");HiddenDateBox();');");


