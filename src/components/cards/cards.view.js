(function (mg, wn) {
	'use strict';

	mg.views.cards = Backbone.View.extend({

		/**
		*
		*/
		initialize: function (opt) {
			this.template = wn.JST['components/cards/cards'];

			this.collection = new mg.collections.cards({searchTerms: ['dogs', 'cats'], numberOfCards: 8});

			this.listenTo(this.collection, 'sync', this.success);
			this.collection.fetchGifs();

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
			return new mg.views.card({
				container: this.$cardsContainer,
				model: card
			})
		},

		/**
		*
		*/
		success: function () {
			this.render();
			console.log('collection from cards', this.collection);
		}
	});
}(mg, window));