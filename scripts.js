$(function($) { // Safest way to declare jQuery in my opinion. This eliminates the risk of collisions with other frameworks.

	var kittentimeout;
	var kitteninterval;

	$('#btn-fetch').bind('click', function() {
		clearInterval(kitteninterval); // Stop autmatic refresh if the user takes control. We do this to reset the timer so that the images are shown 30 seconds before an automatic refresh happens.
		fetch();
		startinterval(kitteninterval);
	});

	$('#btn-about').bind('click', function() {
		$('#about').fadeIn(800);
	});

	$('#btn-exit').bind('click', function() {
		exit();
	});

	$('#about-close').bind('click', function() {
		$('#about').fadeOut(200);
	});

	function fetch() {

		$('.spinner').show();

		// These declarations save memory. I use a $ to indicate that they are jQuery objects. This way its easy to separate them from regular variables.
		let $images = $('#images');
		let $invalid = $('#invalid');
		let $invalidholder = $('#invalid-holder');

		$images.empty();
		$invalid.empty();
		$invalidholder.hide();

		$.get('fetch.php', function(data) {

			$('.spinner').hide();

			if(data == 0) {

				clearTimeout(kittentimeout);

				$images.css({'align-items': 'flex-start'});
				$images.html('<h3>No data was provided from the API... Maybe we should notify someone if this happens?</h3>');

				kittentimeout = setTimeout(function() {
					$images.append('\
						<h3>Ah nevermind, here\'s some kittens instead.</h3>\
						<div id="imgholder-1" class="image-holder">\
								<img id="img1" src="http://placekitten.com/550/300" style="width: 550px;">\
							</div>');
					$('.image-holder').fadeIn(400);
				}, 4000);

			} else {

				clearTimeout(kittentimeout);

				let parseddata = $.parseJSON(data);

				if(typeof parseddata.valid !== 'undefined') {
					for(let i = 0; i <= parseddata.valid.length-1; i++) {
						$images.append('\
							<div id="imgholder-' + i + '" class="image-holder">\
								<img id="img' + i + '" src="' + parseddata.valid[i].url + '">\
								<p>' + parseddata.valid[i].comment + '</p>\
							</div>');
						$('.image-holder').fadeIn(400);
					}
				} else {
					$images.append('\
						<h3>The API couldn\'t give us any valid images, so here\'s a picture of a kitten instead.</h3>\
						<div id="imgholder-1" class="image-holder">\
								<img id="img1" src="http://placekitten.com/400/250" style="width: 400px;">\
								<p>Kittens are awesome.</p>\
							</div>');
					$('.image-holder').fadeIn(400);
				}

				if(typeof parseddata.invalid !== 'undefined') {
					for(let i = 0; i <= parseddata.invalid.length-1; i++) {
						$invalid.append('<li>' + parseddata.invalid[i].url + '</li>');
					}
					$invalidholder.fadeIn(200);
				}
			}
		});

	}

	function exit() {

		if(confirm('Are you sure you want to exit this amazing application?')) {

			if(confirm('Come on... It even has kittens!')) {

				alert('Ok... So... I guess we didn\'t provide enough kittens. Don\'t worry, we have a solution!');

				let arr_kittens = [];
				for(let i = 0; i <= 40; i++) { // I'm really sorry about this PlaceKitten, but it had to be done...
					let kittenwidth = Math.floor((Math.random() * (400 - 200) + 200));
					let kittenheight = Math.floor((Math.random() * (400 - 200) + 200));
					$('body').append('<img src="http://placekitten.com/' + kittenwidth + '/' + kittenheight + '" class="randomkitten" style="top: ' + Math.floor((Math.random() * ($(document).height() - 20) + 20) - kittenheight) + 'px; left: ' + Math.floor((Math.random() * ($(document).width() - 20) + 20) - kittenwidth) + 'px;">');
				}

				setTimeout(function() {
					confirm('There, doesn\'t that make you feel alot better?');
					alert('Ok, sorry... I\'ll let you leave now...');
					location.href = 'https://www.youtube.com/watch?v=LI7-Cu-9wWM';
				}, 3000);
			}
		}
	}

	function startinterval(interval) {
		kitteninterval = setInterval(fetch, 30000);
	}

	fetch(); // Initial fetch
	startinterval(kitteninterval);

});