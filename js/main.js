
	var selectYear="2016";
	var selectSegment = 0;
	var segment1= [];
	var segment2= [];
	var segment3= [];
	var segment4= [];
	var segmentInfo = [segment1,segment2,segment3,segment4];

	var dataSchema = {
			container:"#pc",
			scale:"linear",
			columns:["university_name","teaching","international","research","citations","student_staff_ratio","total_score","world_rank"],//"international_students"],

			ref:"university_name",
			title_column:"university_name",
			scale_map:{
				"university_name":"ordinal",
				"teaching":"ordinal",
				"international":"ordinal",
				"research":"ordinal",
				"citations":"ordinal",
				"student_staff_ratio":"ordinal",
				"total_score":"ordinal",
				"world_rank":"linear"
			},
			use:{
				"university_name":"total_score"
			},
			sorting:{
				"world_rank":d3.descending
			},

			dimensions:["university_name","teaching","total_score","international","research","citations","student_staff_ratio","total_score","world_rank"],//,"international_students"],
			column_map:{
				"university_name":["University Name"],
				"teaching":"Teaching",
				"international":"International",
				"research":"Research",
				"citations":["Citations"],
				"student_staff_ratio":["Student Staff","Ratio"],
				"total_score":["Total Score"],
				"world_rank":["World","Rank"]
			},
			help:{
				"university_name":"<h4>University Name</h4>University Name<br/>Ordered by activity rank.",
				"teaching":"<h4>Teaching</h4>Teaching Score of the university.",
				"international":"<h4>International</h4>International score.",
				"research":"<h4>Research</h4>Research Score",
				"citations":"<h4>Citations</h4>Citation Score.",
				"total_score":"<h4>Total Score</h4>Total Score of University",
				"student_staff_ratio":"<h4>Students VS Staff Ratio</h4>Students numbers vs staff numbers ratio.",
				"world_rank":"<h4>world rank</h4>World Rank of University."
			},
			duration:1,
			path:"data/",
			extension:"csv"
		};

	function AynalyseUniversityInfo(selectYear, selectSegment){

		d3.csv("metadata/"+selectYear+".csv",function(q){
			return q;
		},function(data){
			for (var i = 0; i < data.length; i++) {
	            	var n = Math.floor(i/25);
	            	var j = Math.round(i%25);
	                segmentInfo[n][j]= data[i];
	            }
		
			pc=new UniversityAnalysis(segmentInfo[selectSegment],dataSchema);

		});

	}


	
	AynalyseUniversityInfo(selectYear, selectSegment);


	// d3.select("#sy_select")
	// 		.selectAll("a")
	// 		.data(["2011","2012","2013","2014","2015","2016"])
	// 		.on("click",function(d){
	// 			d3.event.preventDefault();
	// 			d3.selectAll("#sy_select a")
	// 				.classed("selected",false);
	// 			d3.select(this).classed("selected",true);
			
	// 			selectYear =d;
	//             document.getElementById('pc').innerHTML="";
	// 			AynalyseUniversityInfo(selectYear, selectSegment);
	// 		});

	// d3.select("#sr_select")
	// 		.selectAll("a")
	// 		.data(["1-25","26-50","51-75","76-100"])
	// 		.on("click",function(d){
	// 			d3.event.preventDefault();
	// 			d3.selectAll("#sr_select a")
	// 				.classed("selected",false);
	// 			d3.select(this).classed("selected",true);
				
	// 			switch(d) {
	// 				case "1-25" : selectSegment =0;
	// 				case "26-50" : selectSegment =1;
	// 				case "51-75" : selectSegment =2;
	// 				case "76-100" : selectSegment =3;
	// 			}

	//             document.getElementById('pc').innerHTML="";
	// 			AynalyseUniversityInfo(selectYear, selectSegment);
	// 		});
