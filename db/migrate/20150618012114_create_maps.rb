class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.string :crime
      t.decimal :lat
      t.decimal :lon

      t.timestamps null: false
    end
  end
end
