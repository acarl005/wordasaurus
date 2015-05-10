helpers do

  def get_user(email)
    return User.where(email: email).first || redirect('/')
  end

  def find_user(id)
    begin
      return User.find(id)
    rescue ActiveRecord::RecordNotFound
      redirect('/')
    end
  end

  def login(user)
    session[:user_id] = user.id
  end

  def logout
    session.delete(:user_id)
  end

  def logged_in?
    !!current_user
  end

  def current_user
    session[:user_id]
  end

end
