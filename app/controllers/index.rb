get('/') do
  @user = User.new
  erb(:index, locals: {log_error: false})
end

post('/session') do
  @user = User.where(email: params[:email]).first
  if @user && @user.password == params[:password]
    login(@user)
    redirect('/')
  end
  @user = User.new(email: params[:email])
  status(401)
  erb(:index, locals: {log_error: true})
end

post('/users') do
  @user = User.new(
    email: params[:email],
    password: params[:password],
  )
  @user.errors.add(:password, "doesn't match") if params[:password] != params[:conf_password]
  if @user.errors.empty? && @user.save
    login(@user)
  else
    status(400)
    return erb(:index, locals: {log_error: false})
  end
  redirect('/')
end

get('/logout') do
  logout
  redirect('/')
end

get('/users/current', provides: :json) do
  @user = find_user(current_user)
  return @user.to_json
end

get('/users/:id', provides: :json) do
  @user = find_user(params[:id].to_i)
  return @user.to_json
end

get('/users/:id/pieces', provides: :json) do
  @user = find_user(params[:id].to_i)
  return @user.pieces.to_json
end

get('/pieces/:id/syns', provides: :json) do
  @piece = Piece.find(params[:id])
  return @piece.syn_json || "{}"
end

post('/pieces/:id/syns') do
  @piece = Piece.find(params[:id])
  data_ = JSON.parse(request.body.read)
  @piece.syn_json = data_['syn_json']
  if @piece.save
    status(200)
  else
    status(400)
  end
end

put('/pieces/:id') do
  @user = find_user(current_user)
  @piece = @user.pieces.find(params[:id])
  @piece.content = JSON.parse(request.body.read)['content']
  if @piece.save
    status(200)
  else
    status(422)
  end
end

post('/pieces') do
  @user = find_user(current_user)
  data = JSON.parse(request.body.read)
  # binding.pry
  @piece = Piece.new(title: data["title"], content: data["content"])
  if @user.pieces << @piece
    status(200)
    return @piece.to_json
  else
    status(401)
  end
end

delete('/pieces/:id') do
  @piece = Piece.find(params[:id])
  if @piece.user.id == current_user
    @piece.destroy
    return params[:id]
  else
    status 422
    'errors'
  end
end

get('/synonyms/:word', provides: :json) do
  HTTParty.get("http://words.bighugelabs.com/api/2/#{ENV['THES_API']}/#{params[:word]}/json").parsed_response
end
