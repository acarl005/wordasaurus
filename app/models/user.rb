require 'bcrypt'

class User < ActiveRecord::Base
  has_many(:pieces)
  validates(:email,
            uniqueness: true,
            format: { with: /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i } )
  validates(:password, presence: true)

  def password
    @password ||= BCrypt::Password.new(password_crypt) if password_crypt.present?
  end

  def password=(new_pass)
    if new_pass == ''
      errors.add(:password, "cannot be blank")
      return
    end
    @password = BCrypt::Password.create(new_pass)
    self.password_crypt = @password
  end
end
