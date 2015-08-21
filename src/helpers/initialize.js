$(function () {
	(function (mg) {
		console.log('body', $('body'));
		new mg.views.card({
			el: $('body')
		});
	}(mg));
});