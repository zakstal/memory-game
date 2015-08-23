(function (mg) {
	'use strict';

	mg.views.cardPairs = Backbone.View.extend({
		/**
		*
		*/
		initialize: function (opt) {
			this.$container = opt.container

			//TODO: this number of cards should be passed in as an option
			this.numberOfCards = 2;
			this.listenTo(this.model, 'change:show-card', this.countOpenCards);
			this.listenTo(this.model.collection, 'chage:close-cards', this.resteOpenCount);
			this.render();
		},

		/**
		*
		*/
		render: function () {
			this.renderCards();
		},

		/**
		*
		*/
		renderCards: function () {
			for (var i = 0; i < this.numberOfCards; i++) {
				new mg.views.card({
					container: this.$container,
					model: this.model
				})
			}
		},

		/**
		*
		*/
		countOpenCards: function () {
			this.numberOpen = this.numberOpen || 0;
			this.numberOpen++;
			if (this.numberOpen === this.numberOfCards) {
				this.model.trigger('change:hide-cards');
			}
		},

		/**
		*
		*/
		resteOpenCount: function () {
			this.numberOpen = 0;
		},


	});
}(mg));