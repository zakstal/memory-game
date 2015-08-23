
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
			'click .cube': 'flipCardShow'
		},

		/**
		*
		*/
		initialize: function (opt) {
			this.$container = opt.container;
			this.template = JST['components/card/card']
			this.isHidden = false;

			this.listenTo(this.model, 'change:hide-cards', this.hideCards);
			this.listenTo(this.model.collection, 'chage:close-cards', this.closeCard);
			this.render();
		},

		/**
		*
		*/
		render: function () {
			console.log('mode', this.model);
			this.$el.html(this.template({
				gifUrl: this.model.gifSource()
			}));
			this.$container.append(this.$el);
			this.$cube = this.$('.cube');
		},

		/**
		*
		*/
		flipCardShow: function (e) {
			if (!this.isHidden) {
				$(e.currentTarget).addClass('rotate');
				this.model.trigger('change:show-card');
			}
		},

		/**
		*
		*/
		closeCard: function () {
			this.$cube.removeClass('rotate');
		},

		/**
		*
		*/
		hideCards: function () {
			this.$el.addClass('hide');
			this.isHidden = true;
		}

	});
}(mg, window));
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
			var model = new mg.models.card(model);
			this.cards.add(model);
		},

		/**
		*
		*/
		parse: function (res) {
			var model;
			for (var i = 0; i < this.limit; i++) {
				model = this.getRandRes(res);
				this.setModels(model);
			}
		}
	});
}(mg));
(function (mg) {
	'use strict';

	mg.models.card = Backbone.Model.extend({

		/**
		*
		*/
		initialize: function () {
			console.log('in card model');
			this.changeId();
		},

		/**
		*
		*/
		gifSource: function () {
			return 'https://media.giphy.com/media/' + this.gifId + '/giphy.gif';
		},

		/**
		*
		*/
		changeId: function () {
			this.gifId = this.id;
			this.id = Math.random().toString(36).substring(7);
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
$(function () {
	(function (mg) {
		console.log('body', $('body'));
		new mg.views.cards({
			el: $('body')
		});
	}(mg));
});