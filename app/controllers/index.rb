get('/') do
  erb(:index)
end

post('/session') do
  @user = get_user(params[:id])
  if @user.password == params[:password]
    login(@user)
    redirect('/')
  else
    status(401)
    return 'invalid info'
  end
end

get('/users/current') do
  @user = get_user(current_user)
  return @user.to_json if request.xhr?
end

get('/users/:id') do
  @user = get_user(params[:id])
  return @user.to_json if request.xhr?
end

get('/users/:id/pieces') do
  @user = get_user(params[:id])
  return @user.essays.to_json if request.xhr?
end
