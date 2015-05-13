get('/') do
  erb(:index)
end

post('/session') do
  @user = User.where(email: params[:email]).first
  if @user && @user.password == params[:password]
    login(@user)
    redirect('/')
  else
    status(401)
    return 'invalid password'
  end
  status(400)
  return 'email not found'
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
  @piece = Piece.new(title: params[:title], content: params[:content])
  if @user.pieces << @piece
    status(200)
    redirect('/#/my_pieces')
  else
    status(401)
  end
end

get('/sample', provides: :json) do
  return {
    noun: {
      syn: [
        "illustration",
        "instance",
        "representative",
        "model",
        "exemplar",
        "good example",
        "deterrent example",
        "lesson",
        "object lesson",
        "case",
        "exercise",
        "admonition",
        "happening",
        "ideal",
        "information",
        "internal representation",
        "mental representation",
        "monition",
        "natural event",
        "occurrence",
        "occurrent",
        "representation",
        "warning",
        "word of advice"
      ]
    }
  }.to_json
end
