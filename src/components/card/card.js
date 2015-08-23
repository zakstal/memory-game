(function (mg, wn) {
	'use strict';

	mg.views.card = Backbone.View.extend({

		className: 'card',

		events: {
			'click .cube': 'flipCard'
		},

		/**
		*
		*/
		initialize: function (opt) {
			this.$container = opt.container;
			console.log('card model', this.model);
			this.template = JST['components/card/card']
			this.render();
		},

		/**
		*
		*/
		render: function () {
			console.log('in card render');
			this.$el.html(this.template({
				model: this.model.get('embed_url')
			}));
			this.$image = this.$('img');
			this.$image.attr('src', this.model.get('embed_url'));
			this.$container.append(this.$el);
			console.log('image', this.$image.attr('data-view'));
		},

		/**
		*
		*/
		flipCard: function (e) {
			console.log('flip');
			$(e.currentTarget).toggleClass('rotate');
		}
	});
}(mg, window));