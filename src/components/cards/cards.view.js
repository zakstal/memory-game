(function (mg, wn) {
	'use strict';

	mg.views.cards = Backbone.View.extend({

		/**
		*
		*/
		initialize: function (opt) {
			this.template = wn.JST['components/cards/cards'];

			this.collection = new mg.collections.cards({searchTerms: ['dogs'], numberOfCards: 6});

			this.listenTo(this.collection, 'sync', this.success);
			this.listenTo(this.collection.cards, 'change:show-card', this.countOpenCards);
			this.collection.fetchGifs();
			this.numberOfCardDubs = 2;

			console.log('collection', this.collection);
		},

		/**
		*
		*/
		render: function () {
			this.$el.append(this.template());
			this.$cardsContainer = this.$('.cards');
			this.renderCards();
		},

		/**
		*
		*/
		renderCards: function () {
			this.collection.cards.each(
				this.renderCard.bind(this)
			);
		},

		/**
		*
		*/
		renderCard: function (card) {
			return new mg.views.cardPairs({
				container: this.$cardsContainer,
				model: card
			})
		},

		/**
		*
		*/
		countOpenCards: function () {
			this.openCards = this.openCards || 0;
			this.openCards++;
			var _this = this;
			if (this.numberOfCardDubs === this.openCards) {
				setTimeout(function () {
					_this.collection.cards.trigger('chage:close-cards');
					_this.openCards = 0;
				}, 2000);
			}
		},

		/**
		*
		*/
		success: function () {
			this.render();
		}
	});
}(mg, window));