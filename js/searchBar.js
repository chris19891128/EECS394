function toggleSearchBar(){
	if($('#searchPanel').css('visibility') !== 'visible'){
		$('#searchPanel').css('visibility', 'visible');
		$('#searchBar').css('visibility', 'visible');
	} else{
		$('#searchPanel').css('visibility', 'hidden');
		$('#searchBar').css('visibility', 'hidden');
	}
}