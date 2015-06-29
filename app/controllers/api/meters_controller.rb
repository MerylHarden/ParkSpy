module API
	class MetersController < ApplicationController
		def index
			render json: Meter.all
		end
	end
end