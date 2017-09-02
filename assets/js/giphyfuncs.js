
		var apiKey = "c822f1ae365449acaae3474d90c71ce1";//giphy api key

		var giphy_topics = ["Harry Potter","Ron Weasley","Dobby the House Elf","Sirius Black","Hermione Granger","Professor Severus Snape","Lord Voldemort","Draco Malfoy","Sorting Hat","Ginny Weasley","Hedwig","Hagrid","Dumbledore","McGonagall"]; //names for preset buttons


		//when generate button button is clicked, run function generatebtns
		$("form>#createGenreBtns").on("click",function(){
			generateBtns();
		})

		//function generatebtns to create gif buttons
		generateBtns = function(){
			$("div#giphyBtns").empty();//first, empty btns to create new btns
			if($("input:text").val().length>0){//push entered value in text box to giphy_topics array, if there has been anything entered in text box
				var newBtnTopic = $("input:text").val();
				giphy_topics.push(newBtnTopic);
			}
			for (var i = 0; i<giphy_topics.length; i++){//cycle through giphy_topics to create new buttons and append to div#giphybtns
				var newBtn = $("<button>");
				newBtn.attr("class","giphyGenerator");
				newBtn.attr("type","button");
				newBtn.text(giphy_topics[i]);
				$("div#giphyBtns").append(newBtn);
			}
			$("#giphyText").val("");//reset text box to be empty, thus showing placeholder
		}		

		generateBtns();//on loading of page, we want to run the above function

		//when any of those buttons are clicked, fill gif area
		$(document).on("click",".giphyGenerator",function(){
			//first empty gif area of all previously created gifs
			$("#giphyRow").empty();
			//get url parameters set from user entries
			var search = $(this).text().split(' ').join('+');;
			var numResults = $('#numResults').find(":selected").text();
			var rating=$('input[name=optradio]:checked', 'form').attr("id");
			//create url - depending on if user set rating
			if (typeof rating == 'undefined'){		
				var queryURL = "http://api.giphy.com/v1/gifs/search?q="+search+"&api_key="+apiKey+"&limit="+numResults;
			} else {
				var queryURL = "http://api.giphy.com/v1/gifs/search?q="+search+"&api_key="+apiKey+"&limit=100&rating="+rating;
			}
			//ajax function, using url set above, get data
			$.ajax({
				url:queryURL,
				method:"GET"
			}).done(function(response){
				//set this way to ensure that we get the right number of gifs at the appropriate rating
				for (var i = 0,j=0; j<numResults; i++){
					//reformulate imgurl to allow still and animate states
					var imgURL = response.data[i].embed_url;
					imgURL = imgURL.replace("embed","media");
					imgURL = imgURL.replace("http://","https://media1.").replace("https://","http://media1.");
					imgURL+="/200_s.gif";
					//use this to create new img element
					var newIMG = $("<img src='"+imgURL+"'>");
					//we will use a parent div for rating and img
					var newDiv = $("<div>");
					//for rating
					var newP = $("<p>");
					//sets attributs for img, data-state, class and data animate
					newIMG.attr("class","gif");
					newIMG.attr("data-state","still");
					newIMG.attr("data-animate",imgURL.replace("/200_s.gif","/200.gif"));
					//put url for still img in data-still to allow for toggling between states
					newIMG.attr("data-still",imgURL);
					//set newP attributes
					newP.attr("class","giphyRating text-center");
					//set content for newP
					newP.text("Rating: "+response.data[i].rating);
					//set newDiv class
					newDiv.attr("class","giphyContainer text-center");
					//append p and img tags to div
					newDiv.append(newP);
					newDiv.append(newIMG);
					//conditionally place divs and increment j to count up to appropriate number
					if (typeof rating == 'undefined'){		
						$("#giphyRow").append(newDiv);
						j++;
					} else {
						if(response.data[i].rating==rating){
							$("#giphyRow").append(newDiv);
							j++;
						}
					}				

				}
			})

		})

		//state toggle function - allows for toggling between still and animate states
		$(document).on("click",".gif",function() {
	        var state= $(this).attr("data-state");

            if (state==="still"){
	            $(this).attr("src",$(this).attr("data-animate"));
	            $(this).attr("data-state","animate");
	        } else {
	            $(this).attr("src",$(this).attr("data-still"));
	            $(this).attr("data-state","still");
	        }


	    });