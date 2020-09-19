// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: calendar-check;
const SPACE = 3
const timeFormatter = new DateFormatter()
timeFormatter.useNoDateStyle()
timeFormatter.useShortTimeStyle()

const dateFormatter = new DateFormatter()
dateFormatter.locale = "fr-FR"
dateFormatter.useNoTimeStyle()
dateFormatter.useLongDateStyle()

let maxDate = new Date()
maxDate.setHours(23,59,59,999)
let today = new Date()
today.setHours(0, 0, 0, 0)

let count = 0

const lists = [
    "Rappels",
    "💑",
    "Maison 🏡",
    "Bébé 👶🏻"
]

let reminders = await Reminder.allIncomplete()
reminders = reminders
    .filter(r => 
        lists.includes(r.calendar.title)
        && r.dueDate != null
        && r.dueDate <= maxDate)

const calendars = [
    "Personnel",
    "💑",
    "Bébé 👶🏻",
    "Birthdays",
    "Kilstett",
    "Congés"
]

const cals = await Calendar.forEvents()

let events = await CalendarEvent.today(
    cals.filter(x => calendars.includes(x.title))
)

let widget = new ListWidget()
widget.setPadding(0, 10, 0, 2)

// let gradient = new LinearGradient()
// gradient.locations = [0, 1]
// 
// if (Device.isUsingDarkAppearance()) {
//     gradient.colors = [
//         new Color("28313B"), 
//         new Color("485461")
//     ]
// } else {
//     gradient.colors = [
//         new Color("6190E8"), 
//         new Color("A7BFE8")
//     ]
// }
// 
// widget.backgroundGradient = gradient

let titleText = dateFormatter.string(today)

let title = widget.addText(titleText)
title.centerAlignText()
title.font = Font.boldSystemFont(18)

widget.addSpacer(10)

for (let e of events) {
    let text = "🗓 "
        
    if (e.calendar.title == "Birthdays") {
        text = "🎂 " // 🎁
    }
    
    text += e.title
    
    if (!e.isAllDay) {
        let time = e.startDate
        
        let formattedTime = timeFormatter.string(time)
        
        text += " — " + formattedTime
    }
    
    writeWidgetText(text)
}

for (let r of reminders) {
    let text = r.title
    
    let showTime = r.dueDateIncludesTime 
        && r.dueDate >= today
    
    if (showTime) {
        let time = r.dueDate
        let formattedTime = timeFormatter.string(time)
        
        text += " — " + formattedTime
    }
    
    writeWidgetText("◻️ " + text)
}

if (count == 0) {
    let wt = widget.addText("😎")
    wt.font = Font.regularSystemFont(12)
    wt.lineLimit = 1
    
    wt.centerAlignText()
}

if (!Script.runsInWidget) {
    await widget.presentMedium()
}

function writeWidgetText(text, color) {
    count++
    let wt = widget.addText(text)
    wt.font = Font.regularSystemFont(12)
    wt.lineLimit = 1
    wt.textColor = color
    widget.addSpacer(SPACE)
}

Script.setWidget(widget)
Script.complete()

