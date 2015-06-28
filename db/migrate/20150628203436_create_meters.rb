class CreateMeters < ActiveRecord::Migration
  def change
    create_table :meters do |t|
      t.string :meter_id
      t.string :hourly_rate
      t.string :time_limit
      t.string :days_enforced
      t.string :hours_enforced

      t.timestamps null: false
    end
  end
end
