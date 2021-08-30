const temporary = browser.runtime.id.endsWith('@temporary-addon'); // debugging?
const manifest = browser.runtime.getManifest();
const extname = manifest.name;

const menuid1 = "Open in New Window";
let children = [];

browser.menus.create({
	id: menuid1,
	title: menuid1, 
	contexts: ["bookmark"],
	visible: false,
	onclick: function(info, tab) {
		if(info.bookmarkId ) {
			if(Array.isArray(children) && children.length > 0) {
				if(temporary) { console.debug(children);}	
				browser.windows.create({
					url: children
				});
			}
		}
	}
});

browser.menus.onShown.addListener(async function(info, tab) {
	if(info.bookmarkId ) {
		children = (await browser.bookmarks.getChildren(info.bookmarkId)).filter( child => child.url).map( child => child.url);
		if(Array.isArray(children) && children.length > 0) {
			browser.menus.update(menuid1, {visible: true});
		}else{
			browser.menus.update(menuid1, {visible: false});
		}
	}
	browser.menus.refresh();
});

