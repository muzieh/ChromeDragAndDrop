window.addEventListener('load', function() {
	console.log("window load");		
	var dnd = dragAndDropModule;
	dnd.init('dropzone');
	dnd.tick();
});


var dragAndDropModule = (function() {

	var dropzone;

	function init(dropZoneId) {

		console.log('dragndrop init function');
		dropzone = document.getElementById(dropZoneId);
		dropzone.addEventListener('drop', onDrop); 
		dropzone.addEventListener('dragover', onDragover); 
		dropzone.addEventListener('dragenter', onDragenter); 
		dropzone.addEventListener('dragleave', onDragleave); 
	}

	function onDrop(e) {
		console.log('onDrop');
		e.preventDefault();
		e.stopPropagation();

		var length = e.dataTransfer.files.length;
		var topLevelEntries = [];
		for(var i=0; i<length; i++) {
			var entry = e.dataTransfer.items[i].webkitGetAsEntry();
			topLevelEntries.push(entry);
		}

		if(topLevelEntries.length > 0) {
			readAllEntries(topLevelEntries)
		}

		return false;
	}


	var callbackArray = [];

	function registerCallbacks(directories) {
		callbackArray = callbackArray.concat(directories);
	}

	function unregisterCallback(callbacks, directory) {
		var index = callbacks.indexOf(directory);
		if(index > -1) {
			callbacks.splice(index, 1);
		}

		return callbacks.length == 0;
	}

	function readAllEntries(entries) {
		var entriesCount = entries.length;
		var acc = [];
		callbacksArray = [];
		var directories = entries.filter(function(entry) { return !entry.isFile; });

		registerCallbacks(directories);

		for(var i=0; i<entriesCount; i++) {
			var entry = entries[i];
			acc.push(entry);
			if(!entry.isFile) {
				traverseDirectory(entry, callbackArray, acc, function(entries, parent) { 
					//preocess entries
					//deregister callback
					//no more callbacks?

					console.log('done reading top Level Entry for ' + parent.fullPath);
					displayAllContent(entries);
					console.log('-----------')
					//if(unregisterCallback(callbacks, parent)) {
					//	console.log('done readin folders');
					//	displayAllContent(entries);
					//}
				});
			}

		}
		
		function displayAllContent(entries) {
			for(var j=0; j<entries.length; j++) {
				var e = entries[j];
				console.log("path: " + e.fullPath + " isFile: " + e.isFile );
			}
		}		

		return entries;
	}

	


	function toArray(list) {
	  return Array.prototype.slice.call(list || [], 0);
	}

	function traverseDirectory(directoryEntry, callbacks, acc, readCompletedCallback) {
		var dirReader = directoryEntry.createReader();
		var entries = [];
		var readEntries = function(entries) {
			dirReader.readEntries (function(results) {
				if (!results.length) {
					console.log('done reading subdirs for Level Entry for ' + parent.fullPath);
					readCompletedCallback(entries, null);
				} else {

					/*
					if(resultsArray && resultsArray.length > 0) {
						var numberOfEntries = resultsArray.length;
						for(var i=0; i<numberOfEntries; i++) {
							var entry = resultsArray[i];
							acc.push(entry);
							//console.log("path: " + entry.fullPath + " isFile: " + entry.isFile );
							if(!entry.isFile) {
								traverseDirectory(entry, callbacks, acc, function(acc) {return acc;});
							}
						}

					}
					*/
					entires = entries.concat(toArray(results));
					readEntries(entries);
				}
			}, function() {console.log('error');});
  		};

  		readEntries(entries); // Start reading dirs.
	}
	
	function onDragover (e) {
		e.preventDefault();
	}	

	function onDragenter (e) {
		dropZoneActive();
	}	

	function onDragleave (e) {
		dropZoneInactive();
	}	

	function dropZoneActive() {
		dropzone.classList.add('active');
	}

	function dropZoneInactive() {
		dropzone.classList.remove('active');
	}


	return {
		'init' : init,
		'tick' : function() {console.log('tick');}
	}

})(); 