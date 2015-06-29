class Meter < ActiveRecord::Base
	validates :meter_id, presence: true

	def as_json(options={})
		super(except: [:id, :created_at, :updated_at], methods: [:description])
	end

	def description
		"This meter has a #{time_limit} limit. You can park here #{days_enforced} from #{hours_enforced} at an hourly rate of $#{hourly_rate}."
	end
end
