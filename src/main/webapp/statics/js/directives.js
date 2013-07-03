'use strict';

/* Directives */

angular.module('demoDirectives', ['ngResource'])
    /**
     * 以指定格式显示当前时间
     */
	.directive('myCurrentTime', function($timeout, dateFilter) {
	  return function(scope, element, attrs) {

	    scope.$watch(attrs.myCurrentTime, function(value) {

	      //以指定格式显示当前时间
	      element.text(dateFilter(new Date(), value));
	    });

	  }
	})
	/**
	 * 用传入的url返回的类型列表(json)填充下拉列表
	 */
	.directive('selectItems', function($http) {
	  return function(scope, element, attrs) {

	    scope.$watch(attrs.selectItems, function(url) {

	    	 //将原有option移除
	    	 element.children().remove();

	    	 $http.get(url).success(function(data) {

	    		 //遍历列表集合
	    		 angular.forEach(data, function(value, key){

	    			  // 拼接option并添加到select中
	    			  var tt = "<option value ='" + value.id + "'>" + value.name + "</option>";
	    		      element.append(tt);

	    			});
	    	  });

	    });

	  }
});