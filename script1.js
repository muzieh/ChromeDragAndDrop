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
		var entries = [];
		for(var i=0; i<length; i++) {
			var entry = e.dataTransfer.items[i].webkitGetAsEntry();
			entries.push(entry)
			if(entry.isFile) {
				console.log("file: " + entry.name);
			} else if (entry.isDirectory) {
				console.log('directory: ' + entry.name);
				traverseDirectory(entry,
					function(readEntries) {
						if(readEntries && readEntries.length > 0) {
							for(var ient=0; ient < readEntries.length; ient++) {
								var ent = readEntries[ient];
								console.log("isFile: " + ent.isFile + "  path: " + ent.fullPath);
							}
						}
					});
				/*
				var reader = entry.createReader(),
                    list = [],
                    r = function() {
                        reader.readEntries(function(t) {
                            if (t.length) {
                                var n = Array.prototype.slice.call(t || [], 0);
                                list = list.concat(n), r()
                            } else s.handle_directory_read_success(entry, l, a, i, o)
                        }, function() {
                            this.handle_error_in_entry_read(i), this.check_is_directory_conversion_complete(i, o)
                        })
                    };
                    r();
                 */
			}

		}

		return false;
	}

	function toArray(list) {
	  return Array.prototype.slice.call(list || [], 0);
	}

	function traverseDirectory(directoryEntry, readCompletedCallback) {
		var dirReader = directoryEntry.createReader();
		var entries = [];
		var readEntries = function() {
			dirReader.readEntries (function(results) {
				if (!results.length) {
					if(entries.length > 0) {
						var numberOfEntries = entries.length;
						for(var i=0; i<numberOfEntries; i++) {
							var entry = entries[i];
							if(!entry.isFile) {
								traverseDirectory(entry, function(entries) {
									debugger;
								});
							}
						}

					}

					readCompletedCallback(entries);
				} else {
					entries = entries.concat(toArray(results));
					readEntries();
				}
			}, function() {console.log('error');});
  		};

  		readEntries(); // Start reading dirs.
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