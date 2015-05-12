class CreatePieces < ActiveRecord::Migration
  def change
    create_table(:pieces) do |t|
      t.string(:title)
      t.text(:content, limit: 400000000)
      t.text(:syn_json, limit: 400000000, default: '')
      t.integer(:user_id)
      t.timestamps
    end
  end
end
