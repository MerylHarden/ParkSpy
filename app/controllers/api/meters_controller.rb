module API
	class MetersController < ApplicationController

		protect_from_forgery with: :null_session

		def index
			render json: Meter.all
		end

		def show
			render json: Meter.find(params[:id])
		end

		def create
			meter = Meter.new(meter_params)

			if meter.save
				render json: meter, status: 201, location: [:api, meter]
			else
				render json: meter.errors, status: 422
			end
		end

		def update
			meter.Meter.find(params[:id])
			if meter.update(meter_params)
				head 204
			else
				render json: meter.errors, status: 422
			end
		end

		def destroy
			meter.Meter.find(params[:id])
			meter.destroy
			head 204
		end

		private
		def meter_params
			params.require(:meter).permit(:meter_id, :hourly_rate, :time_limit, :days_enforced, :hours_enforced)
		end

	end
end