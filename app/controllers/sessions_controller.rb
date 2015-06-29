class SessionsController < ApplicationController
  def index
  end

  def new
    user = User.new
  end

  def create
    user = User.find_by(email: params[:login][:email])

    if user && user.authenticate(params[:login][:password]) 
      session[:user_id] = user.id.to_s
      redirect_to maps_path
    else
      render :new
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to login_path
  end
end