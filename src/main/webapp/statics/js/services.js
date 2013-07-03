'use strict';

/* Services */

angular.module('demoServices', []).
    factory('arrayUtil', function(){
    	return {
    		/**
    		 * 计算属性乘积和
    		 * 遍历集合中的每个对象，算出给定的属性乘积，累加到总和中
    		 */
    		productsum: function(array, pro1, pro2) {

    			var sum = 0;
    			//遍历集合
    			for (var i = 0; i < array.length; i++) {

    				var obj = array[i];

    				//计算对象的属性乘积并添加到总和中
    				sum += obj[pro1] * obj[pro2];
    			}

    			return sum;
    		},

    		/**
    		 * 计算属性和
    		 * 遍历集合中的每个对象，累加给定属性的和
    		 */
    		sum: function(array, pro) {

    			var sum = 0;
    			for (var i = 0; i < array.length; i++) {


    				var obj = array[i];

    				//累计对象的属性和
    				sum += obj[pro];
    			}

    			return sum;
    		}
    	}
 });
