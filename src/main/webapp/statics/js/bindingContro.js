
/* Controllers */

function bindingCtrl( $scope, $window, arrayUtil) {
	$scope.foods = [
	        		{"id":15131,"name":"芋艿筒骨煲", "price":16.0, "soldSize":43},
	        		{"id":15132,"name":"玉米筒骨煲", "price":19.0, "soldSize":63},
	        		{"id":15133,"name":"油豆腐筒骨煲", "price":14.0, "soldSize":23},
	        		{"id":15134,"name":"香菇筒骨煲", "price":21.0, "soldSize":48},
	        		{"id":15135,"name":"西红柿筒骨煲", "price":20.0, "soldSize":44},
	        		{"id":15136,"name":"土豆筒骨煲", "price":21.0, "soldSize":23},
	        		{"id":15137,"name":"海带筒骨煲", "price":19.0, "soldSize":26},
	        		{"id":15138,"name":"金针菇筒骨煲", "price":16.0, "soldSize":67},
	        		{"id":15139,"name":"萝卜筒骨煲", "price":12.0, "soldSize":211},
	        		{"id":15140,"name":"千张筒骨煲", "price":17.0, "soldSize":451},
	        		{"id":15141,"name":"冬瓜筒骨煲", "price":24.0, "soldSize":87},
	        		{"id":15142,"name":"青菜筒骨煲", "price":18.0, "soldSize":93}
	        	];

	$scope.diner = new Array();

	/**
	 * 增加餐车食物
	 */
	$scope.addFood = function(food){
		//寻找当前食物是否在餐车中存在，即以前加入过
		var haveFood = baidu.array($scope.diner).find(function(item, index){
			if (food.id == item.id) {
				return true;
			}
		});

		//如果没有，将size清空
		if (haveFood == null) {
			food.size = null;
		}

		//没有数据，新增
		if (food.size == null) {
			food.size = 1;
			$scope.diner.push(food);
		}
		// 有数据，直接增加数量
		else {
			food.size++;
		}
	}

	/**
	 * 减少食物
	 */
	$scope.reduceFoodSize = function(food) {
		//大于1，减少食物
		if (food.size > 1) {
			food.size = food.size - 1;
		}
		//小于1，删除食物
		else {
			baidu.array($scope.diner).remove(food);
		}
	}

	/**
	 * 删除食物
	 */
	$scope.deleteFood = function(food) {
		baidu.array($scope.diner).remove(food);
	}

	/**
	 * 清空餐车
	 */
	$scope.clearDiner = function(){
		baidu.array($scope.diner).empty();
	}

	/**
	 * 餐品总数
	 */
	$scope.totalSize = function(diner) {
		return arrayUtil.sum(diner, 'size');
	}

	/**
	 * 餐品总价
	 */
	$scope.totalPrice = function(diner) {
		return arrayUtil.productsum(diner, 'price', 'size');
	}
}