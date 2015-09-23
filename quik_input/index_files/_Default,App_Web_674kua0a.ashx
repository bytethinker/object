_Default_class = function() {};
Object.extend(_Default_class.prototype, Object.extend(new AjaxPro.AjaxClass(), {
	GetHtml: function() {
		return this.invoke("GetHtml", {}, this.GetHtml.getArguments().slice(0));
	},
	url: '/ajaxpro/_Default,App_Web_674kua0a.ashx'
}));
_Default = new _Default_class();

