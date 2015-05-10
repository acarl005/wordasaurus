get('/') do
  erb(:index)
end

post('/session') do
  @user = get_user(params[:email])
  if @user.password == params[:password]
    login(@user)
    redirect('/')
  else
    status(401)
    return 'invalid info'
  end
end

get('/users/current') do
  @user = find_user(current_user)
  p @user.to_json
  return @user.to_json
end

get('/users/:id') do
  @user = find_user(params[:id].to_i)
  return @user.to_json
end

get('/users/:id/pieces') do
  @user = find_user(params[:id].to_i)
  return @user.pieces.to_json
end
