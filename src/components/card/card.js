(function (mg, wn) {
	'use strict';

	mg.views.card = Backbone.View.extend({

		/**
		*
		*/
		initialize: function () {
			this.template = wn.JST['components/card/card']
			this.render();
		},

		/**
		*
		*/
		render: function () {
			console.log('in render');
			this.$el.html(this.template());
		}
	});
}(mg, window));