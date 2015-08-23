
var globals = {};

var mg = {};
mg.views = {};
mg.models = {};
mg.collections = {};

var JST = window.JST;

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
(function (mg) {
	'use strict';

	mg.collections.cards = Backbone.Collection.extend({

		/**
		*
		*/
		url: function (searchTerm) {
			return "https://api.giphy.com/v1/gifs/search?&api_key=dc6zaTOxFJmzC";
		},

		/**
		*
		*/
		initialize: function (opt) {
			this.listenTo(this, 'sync', this.success);
			this.cards = new Backbone.Collection();

			this.searchTerms = opt.searchTerms;
			this.numberOfCards = opt.numberOfCards;

			this.searchObject = {};
			this.setSearchLimit();
			this.setSearchTerms();
			this.trimSearchTerms();

			console.log('in gif collection', opt);
		},

		/**
		* Receives an array of search terms
		*/
		fetchGifs: function () {
			_.each(this.searchTerms, this.fetchTerm.bind(this));
		},

		/**
		* Fetches a single search term
		*/
		fetchTerm: function (searchTerm) {
			console.log('search term', searchTerm);
			this.searchObject.q = searchTerm;
			this.fetch({
				data: this.searchObject
			});
		},

		/**
		* Returns the number cards per search term
		* to GET
		*/
		setSearchLimit: function () {
			this.limit = this.numberOfCards / 2;
			if (this.limit > 25) {
				this.searchObject.limit = this.limit
			}
		},

		/**
		* If there are more search terms than cards
		* search terms will be reduced to the limit
		*/
		setSearchTerms: function () {
			if (this.limit < this.searchTerms.length) {
				this.searchTerms = this.searchTerms.slice(0, this.limit);
			}
		},

		/**
		* Only allows even number of search terms other than one
		*/
		trimSearchTerms: function () {
			if (this.searchTerms.length !== 1 && this.searchTerms.length % 2 !== 0) {
				this.searchTerms.pop();
			}
		},

		/*
		* Gets a random object from results to set as 
		* a model
		*/
		getRandRes: function (res) {
			var objIdx = Math.floor(Math.random() * res.data.length);
			var obj = res.data[objIdx];
			delete res.data[objIdx];
			return obj;
		},

		/**
		* Sets models from response to cards collection
		*/
		setModels: function (model) {
			console.log('set models', model);
			var model;
			for (var i = 0; i < 2; i++) {
				model = new Backbone.Model(model);
				this.cards.add(model);
			}
		},

		/**
		*
		*/
		parse: function (res) {
			console.log('in parse', res);
			var model;
			for (var i = 0; i < this.limit; i++) {
				model = this.getRandRes(res);
				this.setModels(model);
			}
		}
	});
}(mg));
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
$(function () {
	(function (mg) {
		console.log('body', $('body'));
		new mg.views.cards({
			el: $('body')
		});
	}(mg));
});