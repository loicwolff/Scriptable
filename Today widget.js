// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: calendar-alt;
const widget = new ListWidget()
widget.spacing = 15
const df = new DateFormatter()
df.locale = "fr-FR"

let maxDate = new Date()
maxDate.setHours(23,59,59,999)

const lists = [
    "Rappels",
    "💑",
    "Maison 🏡",
    "Bébé 👶🏻"
]

let reminders = await Reminder.allIncomplete()
let remindersCount = reminders
    .filter(r => lists.includes(r.calendar.title)
        && r.dueDate != null
        && r.dueDate <= maxDate)
    .length
                   

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

let eventsCount = events.length

let date = new Date()

// day
df.dateFormat = "EEEE"
let dayText = widget.addText(df.string(date))
dayText.centerAlignText()
dayText.font = Font.subheadline()

// date
df.dateFormat = "d MMM"
let dateText = widget.addText(df.string(date))
dateText.centerAlignText()
dateText.font = Font.title1()

// planning
let agendaText = widget.addText(`🗓 ${eventsCount}\t ✅ ${remindersCount}`)
agendaText.centerAlignText()
agendaText.font = Font.lightSystemFont(15)

Script.setWidget(widget)

if (config.runsInApp) {
    await widget.presentSmall()
}

Script.complete()