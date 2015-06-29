# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def printout(str)
  print str
  $stdout.flush
end

url = "https://raw.githubusercontent.com/CityofSantaMonica/GIS/master/streets/parking/meters.geojson"

puts "Grabbing data from: " + url

response = JSON(HTTParty.get(url).body)

puts "Loading records"
Meter.delete_all

puts response["features"].length
puts response["features"][0]["properties"]["LOCATIONID"]

size = response["features"].length

i = 0
response["features"].each do | row |
	i = i + 1
	Meter.create(meter_id: row["properties"]["LOCATIONID"], hourly_rate: row["properties"]["HOURLYRATE"], time_limit: row["properties"]["TIMELIMIT"], days_enforced: row["properties"]["RSTRCTDAY"], hours_enforced: row["properties"]["RSTRCTTIME"])
	printout "\rProgress: " + i.to_s + " of " + size.to_s
end

puts "\nCompleted"