// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: dollar-sign;
function cleanTitle(title) {
    return title
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\[ios\]/i, "")
        .replace(/\[macos\]/i, "")
        .trim()
}
    
function getAppType(title) {
    if (title.match(/\[ios\]/i)) {
        return "ios"
    } else if (title.match(/\[macos\]/i)) {
        return "macos"
    } else {
        return null
    }
}
    
async function getApps() {
    let url = "https://old.reddit.com/search.json?q=subreddit%3AAppHookup+%28flair%3Aios+OR+flair%3Amacos%29&include_over_18=on&t=week&sort=new"

    let request = new Request(url)
    let json = await request.loadJSON()

    let apps = json.data.children
        .map(x => ({ 
            title: cleanTitle(x.data.title), 
            image: x.data.thumbnail,
            type: getAppType(x.data.title),
            url: x.data.url
        }))
        .slice(0, 5);
        
   return apps
}

async function getTable() {
    let table = new UITable()
    table.dismissOnSelect = false
    table.showSeparators = true
    
    let apps = await getApps()

    for (let app of apps) {
        let row = new UITableRow()

        let i = row.addImageAtURL(app.image)    
        i.widthWeight = 5
        
        let t = row.addText(app.title)
        t.widthWeight = 95
                        
        if (app.type == "ios") {
            let t = row.addText("📱")
            t.widthWeight = 5
        } else if (app.type == "macos") {
            row.addText("🖥")
            t.widthWeight = 5
        }        
        
        row.onSelect = (number) => {
            Safari.open(app.url, true)
        }
        
        table.addRow(row)
    }
    
    return table
}

async function getWidget() {
    let widget = new ListWidget()
    
    let title = widget.addText("AppHookup")
    title.font = Font.title2()
    title.centerAlignText()
    
    widget.addSpacer()
    
    let apps = await getApps()
    
    for (let app of apps) {
        let wt = widget.addText(app.title)
        wt.lineLimit = 1
        wt.font = Font.regularSystemFont(12)
    }
    
    const df = new DateFormatter()
    df.locale = "fr-FR"
    df.useShortDateStyle()
    df.useShortTimeStyle()
    
    widget.addSpacer()
    
    let updateText = widget.addText(df.string(new Date()))
    updateText.font = Font.caption2()
    updateText.centerAlignText()
    updateText.textColor = Color.gray()
    
    return widget
}

if (config.runsInWidget) {
    let widget = await getWidget()
    Script.setWidget(widget)
} else if (config.runsInApp) {
    let table = await getTable()
    QuickLook.present(table, false)
}

Script.complete()